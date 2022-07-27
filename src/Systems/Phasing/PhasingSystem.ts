import { EntityReference, retrieveReference, retrieveReferences } from '../../core/components/EntityReference'
import { fightPhase, Phasing, placementActionPoints, placementPhase, preparingGamePhase, victoryPhase } from '../../core/components/Phasing'
import { Physical, playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition, Position } from '../../core/components/Physical'
import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../core/type/GameEvent'
import { drawEvent } from '../../Events/draw/draw'
import { moveEvent } from '../../Events/move/move'
import { nextTurnEvent } from '../../Events/nextTurn/nextTurn'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { cellMissingOnGrid, currentPhaseNotSupported, missingDefeatPlayerId, missingInitialPosition, missingPlayerInderOnPlayableComponent, unitMissingOnPlayerTowersAndRobots, victoryPlayerMissingOnPlayableComponent } from './port/phasingSystem'
import { Dimension } from '../../core/components/Dimensional'
import { destroySimpleMatchLobbyMenuEvent } from '../../Events/destroy/destroy'
import { Phase } from '../../core/type/Phase'
import { PhaseType } from '../../core/type/PhaseType'

export interface PhaseSequence {
    currentPhase:Phase,
    nextPhase:Phase
}

export class PhasingSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === Action.ready
            ? this.onReady(gameEvent)
            : gameEvent.action === Action.nextTurn
                ? this.onNextTurn(gameEvent)
                : gameEvent.action === Action.victory
                    ? this.onVictory(gameEvent)
                    : Promise.reject(new Error(errorMessageOnUnknownEventAction(PhasingSystem.name, gameEvent)))
    }

    private onVictory (gameEvent: GameEvent): Promise<void> {
        const matchId = this.entityByEntityType(gameEvent, EntityType.match)
        const victoryPlayerId = this.entityByEntityType(gameEvent, EntityType.player)
        const matchEntityReferenceComponent = this.interactWithEntities.retreiveEntityReference(matchId)
        this.applyVictoryPhaseOnPhasingComponent(
            matchEntityReferenceComponent,
            victoryPlayerId,
            this.interactWithEntities.retreivePhasing(matchId)
        )
        const victoryId = retrieveReference(matchEntityReferenceComponent, EntityType.victory)
        const defeatId = retrieveReference(matchEntityReferenceComponent, EntityType.defeat)
        const defeatPlayerId = this.defeatPlayerIdFromMatchEntityReferenceAndVictoryPlayer(matchEntityReferenceComponent, victoryPlayerId)
        this.interactWithEntities.linkEntityToEntities(defeatId, [defeatPlayerId])
        this.interactWithEntities.linkEntityToEntities(victoryId, [victoryPlayerId])
        return this.sendVictoryAndDefeatShowEvents(
            victoryPlayerId,
            defeatPlayerId,
            this.interactWithEntities.retrievePhysical(victoryId),
            this.interactWithEntities.retrievePhysical(defeatId)
        )
    }

    private applyVictoryPhaseOnPhasingComponent (entityReferenceComponent: EntityReference, victoryPlayerId: string, phasingComponent: Phasing) {
        const playerId = retrieveReferences(entityReferenceComponent, EntityType.player).find(playerId => playerId === victoryPlayerId)
        if (!playerId) throw new Error(victoryPlayerMissingOnPlayableComponent(victoryPlayerId))
        const updatedPhasingComponent:Phasing = {
            ...phasingComponent,
            currentPhase: victoryPhase(playerId)
        }
        this.interactWithEntities.saveComponent(updatedPhasingComponent)
    }

    private sendVictoryAndDefeatShowEvents (victoryPlayerId: string, defeatPlayerId:string, victoryPhysicalComponent:Physical, defeatPhysicalComponent:Physical): Promise<void> {
        const updatedVictoryPhysicalComponent:Physical = {
            ...victoryPhysicalComponent,
            visible: true
        }
        const updateDdefeatPhysicalComponent:Physical = {
            ...defeatPhysicalComponent,
            visible: true
        }
        this.interactWithEntities.saveComponent(updatedVictoryPhysicalComponent)
        this.interactWithEntities.saveComponent(updateDdefeatPhysicalComponent)
        return Promise.all([
            this.sendEvent(drawEvent(victoryPlayerId, updatedVictoryPhysicalComponent)),
            this.sendEvent(drawEvent(defeatPlayerId, updateDdefeatPhysicalComponent))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private defeatPlayerIdFromMatchEntityReferenceAndVictoryPlayer (matchEntityReferenceComponent: EntityReference, victoryPlayerId: string) {
        const defeatPlayerId = retrieveReferences(matchEntityReferenceComponent, EntityType.player).find(playerId => playerId !== victoryPlayerId)
        if (defeatPlayerId) return defeatPlayerId
        throw new Error(missingDefeatPlayerId)
    }

    private onNextTurn (gameEvent: GameEvent): Promise<void> {
        const matchPhasingComponent = this.interactWithEntities.retreivePhasing(this.entityByEntityType(gameEvent, EntityType.match))
        const matchEntityReferenceComponent = this.interactWithEntities.retreiveEntityReference(this.entityByEntityType(gameEvent, EntityType.match))
        const phaseSequence = this.phasing(this.playerIdFromEntityReferenceComponentPlayerIndex(0, matchEntityReferenceComponent), this.playerIdFromEntityReferenceComponentPlayerIndex(1, matchEntityReferenceComponent)).find(phaseSequence => (
            phaseSequence.currentPhase.phaseType === matchPhasingComponent.currentPhase.phaseType &&
            phaseSequence.currentPhase.currentPlayerId === matchPhasingComponent.currentPhase.currentPlayerId &&
            phaseSequence.currentPhase.currentUnitId === matchPhasingComponent.currentPhase.currentUnitId
        ))
        return phaseSequence
            ? this.onSupportedCurrentPhase(this.updatePhasingComponentCurrentPhaseWithNextPhase(matchPhasingComponent, phaseSequence.nextPhase), matchEntityReferenceComponent, gameEvent)
            : Promise.reject(new Error(currentPhaseNotSupported(matchPhasingComponent)))
    }

    private playerIdFromEntityReferenceComponentPlayerIndex (playerIndex:number, entityReferenceComponent:EntityReference) {
        const playerIdFromPlayablePlayerIndex = retrieveReferences(entityReferenceComponent, EntityType.player).find((player, index) => index === playerIndex)
        if (playerIdFromPlayablePlayerIndex) return playerIdFromPlayablePlayerIndex
        throw new Error(missingPlayerInderOnPlayableComponent(playerIndex))
    }

    private onSupportedCurrentPhase (matchPhasing: Phasing, matchEntityReference:EntityReference, gameEvent:GameEvent):Promise<void> {
        const events:GameEvent[] = this.eventsOnManualPhases(matchPhasing, matchEntityReference)
        const autoMoveEvent = this.eventsOnPlacementPhase(matchPhasing, gameEvent)
        if (autoMoveEvent) events.push(autoMoveEvent)
        console.log(events)
        return this.sendEvents(events)
    }

    private eventsOnManualPhases (matchPhasingComponent: Phasing, matchEntityReferenceComponent:EntityReference):GameEvent[] {
        const gameEvents:GameEvent[] = []
        if (matchPhasingComponent.currentPhase.phaseType === PhaseType.Fight)
            retrieveReferences(matchEntityReferenceComponent, EntityType.player).forEach(player => {
                const nextTurnButtonId = retrieveReference(this.interactWithEntities.retreiveEntityReference(player), EntityType.nextTurnButton)
                const updatedNextTurnButtonPhysicalComponent:Physical = {
                    ...this.interactWithEntities.retrievePhysical(nextTurnButtonId),
                    visible: player === matchPhasingComponent.currentPhase.currentPlayerId
                }
                this.interactWithEntities.saveComponent(updatedNextTurnButtonPhysicalComponent)
                gameEvents.push(drawEvent(player, updatedNextTurnButtonPhysicalComponent))
            })
        return gameEvents
    }

    private eventsOnPlacementPhase (matchPhasingComponent: Phasing, gameEvent:GameEvent):GameEvent|undefined {
        console.log(matchPhasingComponent)
        return (matchPhasingComponent.currentPhase.phaseType === PhaseType.Placement)
            ? (matchPhasingComponent.currentPhase.currentPlayerId && matchPhasingComponent.currentPhase.currentUnitId)
                ? this.makeMoveToPositionEvent(gameEvent, matchPhasingComponent.currentPhase.currentPlayerId, matchPhasingComponent.currentPhase.currentUnitId)
                : undefined
            : undefined
    }

    private updatePhasingComponentCurrentPhaseWithNextPhase (matchPhasingComponent: Phasing, nextPhase: Phase):Phasing {
        const updatedMatchPhasingComponent:Phasing = {
            ...matchPhasingComponent,
            currentPhase: nextPhase
        }
        this.interactWithEntities.saveComponent(updatedMatchPhasingComponent)
        return updatedMatchPhasingComponent
    }

    private initialPositionFromEntityTypeAndMatchPlayer (entityType:EntityType, playerIndex:number, gridDimension:Dimension, gridFirstCellPosition: Position):Position {
        const positionsMapping :{entityType:EntityType, playerIndex:number, position:Position}[] = [
            { entityType: EntityType.tower, playerIndex: 0, position: playerATowerFirstPosition(gridFirstCellPosition) },
            { entityType: EntityType.robot, playerIndex: 0, position: playerARobotFirstPosition(gridFirstCellPosition) },
            { entityType: EntityType.tower, playerIndex: 1, position: playerBTowerFirstPosition(gridFirstCellPosition, gridDimension) },
            { entityType: EntityType.robot, playerIndex: 1, position: playerBRobotFirstPosition(gridFirstCellPosition, gridDimension) }
        ]
        const positionMapping = positionsMapping.find(positionMapping => (
            positionMapping.entityType === entityType &&
            positionMapping.playerIndex === playerIndex
        ))
        if (positionMapping) return positionMapping.position
        throw new Error(missingInitialPosition(entityType, playerIndex))
    }

    private makeMoveToPositionEvent (gameEvent: GameEvent, currentPlayerId:string, currentUnitId:string): GameEvent {
        const matchId = this.entityByEntityType(gameEvent, EntityType.match)
        const matchEntityReference = this.entityReferencesByEntityId(matchId)
        const entityType = this.entityTypeFromPlayerUnits(currentPlayerId, currentUnitId)
        const matchEntityReferenceComponent = this.interactWithEntities.retreiveEntityReference(matchId)
        const gridId = retrieveReference(matchEntityReference, EntityType.grid)
        const gridDimensionalComponent = this.interactWithEntities.retreiveDimensional(gridId)
        return moveEvent(
            currentPlayerId,
            entityType,
            currentUnitId,
            this.retrieveCellIdWithPosition(
                this.initialPositionFromEntityTypeAndMatchPlayer(entityType, this.playerIndexOnMatch(matchEntityReferenceComponent, currentPlayerId), gridDimensionalComponent.dimensions, this.retrieveGridFirstCellPosition(gridId)),
                retrieveReference(matchEntityReference, EntityType.grid)
            )
        )
    }

    private retrieveGridFirstCellPosition (gridId: string): Position {
        const cellIds = retrieveReferences(this.interactWithEntities.retreiveEntityReference(gridId), EntityType.cell)
        const cellpositions = cellIds.map(cellId => this.interactWithEntities.retrievePhysical(cellId).position)
        let gridFirstCellPosition = cellpositions[0]
        for (let index = 1; index < cellpositions.length; index++)
            if (cellpositions[index].x <= gridFirstCellPosition.x && cellpositions[index].y <= gridFirstCellPosition.y)
                gridFirstCellPosition = cellpositions[index]
        return gridFirstCellPosition
    }

    private playerIndexOnMatch (entityReferenceComponent: EntityReference, playerId:string): number {
        return retrieveReferences(entityReferenceComponent, EntityType.player).findIndex(player => player === playerId)
    }

    private entityTypeFromPlayerUnits (currentPlayerId: string, currentUnitId: string):EntityType {
        const playerEntityReference = this.entityReferencesByEntityId(currentPlayerId)
        const towerFound = retrieveReferences(playerEntityReference, EntityType.tower).some(towerId => towerId === currentUnitId)
        if (towerFound) return EntityType.tower
        const robotFound = retrieveReferences(playerEntityReference, EntityType.robot).some(robotId => robotId === currentUnitId)
        if (robotFound) return EntityType.robot
        throw new Error(unitMissingOnPlayerTowersAndRobots(currentUnitId))
    }

    private retrieveCellIdWithPosition (position:Position, gridId:string): string {
        const cellPhysicalComponent = retrieveReferences(this.entityReferencesByEntityId(gridId), EntityType.cell)
            .map(cellId => this.interactWithEntities.retrievePhysical(cellId))
            .find(cellPhysicalComponent => cellPhysicalComponent.position.x === position.x && cellPhysicalComponent.position.y === position.y)
        if (cellPhysicalComponent) return cellPhysicalComponent.entityId
        throw new Error(cellMissingOnGrid(position, gridId))
    }

    private onReady (gameEvent: GameEvent): Promise<void> {
        const matchId = this.entityByEntityType(gameEvent, EntityType.match)
        const matchPhasingComponent = this.interactWithEntities.retreivePhasing(matchId)
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        matchPhasingComponent.readyPlayers.add(playerId)
        const events:GameEvent[] = [
            ...this.hideAndDestroySimpleMatchLobbyMenuEvents(playerId)
        ]
        if (matchPhasingComponent.readyPlayers.size === 2) events.push(nextTurnEvent(matchId))
        return this.sendEvents(events)
    }

    private hideAndDestroySimpleMatchLobbyMenuEvents (playerId: string): GameEvent[] {
        const playerSimpleMatchLobbyMenu = retrieveReference(this.interactWithEntities.retreiveEntityReference(playerId), EntityType.simpleMatchLobbyMenu)
        const updatedPhysicalComponent:Physical = {
            ...this.interactWithEntities.retrievePhysical(playerSimpleMatchLobbyMenu),
            visible: false
        }
        this.interactWithEntities.saveComponent(updatedPhysicalComponent)
        return [
            drawEvent(playerId, updatedPhysicalComponent),
            destroySimpleMatchLobbyMenuEvent(playerSimpleMatchLobbyMenu)
        ]
    }

    private phasing (playerAId:string, playerBId:string):PhaseSequence[] {
        const playerAEntityReference = this.entityReferencesByEntityId(playerAId)
        const playerBEntityReference = this.entityReferencesByEntityId(playerBId)
        const playerARobotId = retrieveReference(playerAEntityReference, EntityType.robot)
        const playerATowerId = retrieveReference(playerAEntityReference, EntityType.tower)
        const playerBRobotId = retrieveReference(playerBEntityReference, EntityType.robot)
        const PlayerBTowerId = retrieveReference(playerBEntityReference, EntityType.tower)
        return [
            { currentPhase: preparingGamePhase, nextPhase: placementPhase(playerAId, playerATowerId, true, placementActionPoints) },
            { currentPhase: placementPhase(playerAId, playerATowerId, true, placementActionPoints), nextPhase: placementPhase(playerAId, playerARobotId, true, placementActionPoints) },
            { currentPhase: placementPhase(playerAId, playerARobotId, true, placementActionPoints), nextPhase: placementPhase(playerBId, PlayerBTowerId, true, placementActionPoints) },
            { currentPhase: placementPhase(playerBId, PlayerBTowerId, true, placementActionPoints), nextPhase: placementPhase(playerBId, playerBRobotId, true, placementActionPoints) },
            { currentPhase: placementPhase(playerBId, playerBRobotId, true, placementActionPoints), nextPhase: fightPhase(playerAId, playerARobotId) },
            { currentPhase: fightPhase(playerAId, playerARobotId), nextPhase: fightPhase(playerBId, playerBRobotId) },
            { currentPhase: fightPhase(playerBId, playerBRobotId), nextPhase: fightPhase(playerAId, playerATowerId) },
            { currentPhase: fightPhase(playerAId, playerATowerId), nextPhase: fightPhase(playerBId, PlayerBTowerId) },
            { currentPhase: fightPhase(playerBId, PlayerBTowerId), nextPhase: fightPhase(playerAId, playerARobotId) }
        ]
    }
}
