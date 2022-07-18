import { fightPhase, Phasing, placementPhase, preparingGamePhase, victoryPhase } from '../../Components/Phasing'
import { Phase, PhaseType } from '../../Components/port/Phase'
import { nextTurnEvent } from '../../Events/nextTurn/nextTurn'
import { Action } from '../../Event/Action'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { EntityType } from '../../Event/EntityType'
import { Physical, playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition, Position } from '../../Components/Physical'
import { moveEvent } from '../../Events/move/move'
import { cellMissingOnGrid, currentPhaseNotSupported, missingDefeatPlayerId, missingInitialPosition, missingPlayerInderOnPlayableComponent, unitMissingOnPlayerTowersAndRobots, victoryPlayerMissingOnPlayableComponent } from './port/phasingSystem'
import { drawEvent } from '../../Events/draw/draw'
import { Dimension } from '../../Components/port/Dimension'
import { Dimensional } from '../../Components/Dimensional'
import { EntityReference } from '../../Components/EntityReference'
import { destroySimpleMatchLobbyMenuEvent } from '../../Events/destroy/destroy'

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
        const matchEntityReferenceComponent = this.interactWithEntities.retrieveyComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), EntityReference)
        const victoryPlayerId = gameEvent.entityByEntityType(EntityType.player)
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        this.applyVictoryPhaseOnPhasingComponent(
            matchEntityReferenceComponent,
            victoryPlayerId,
            this.interactWithEntities.retrieveyComponentByEntityId(matchId, Phasing)
        )
        const victoryId = matchEntityReferenceComponent.retrieveReference(EntityType.victory)
        const defeatId = matchEntityReferenceComponent.retrieveReference(EntityType.defeat)
        const defeatPlayerId = this.defeatPlayerIdFromMatchEntityReferenceAndVictoryPlayer(matchEntityReferenceComponent, victoryPlayerId)
        this.interactWithEntities.linkEntityToEntities(defeatId, [defeatPlayerId])
        this.interactWithEntities.linkEntityToEntities(victoryId, [victoryPlayerId])
        return this.sendVictoryAndDefeatShowEvents(
            victoryPlayerId,
            defeatPlayerId,
            this.interactWithEntities.retrieveyComponentByEntityId(victoryId, Physical),
            this.interactWithEntities.retrieveyComponentByEntityId(defeatId, Physical)
        )
    }

    private applyVictoryPhaseOnPhasingComponent (entityReferenceComponent: EntityReference, victoryPlayerId: string, phasingComponent: Phasing) {
        const playerId = entityReferenceComponent.retrieveReferences(EntityType.player).find(playerId => playerId === victoryPlayerId)
        if (!playerId) throw new Error(victoryPlayerMissingOnPlayableComponent(victoryPlayerId))
        phasingComponent.currentPhase = victoryPhase(playerId)
    }

    private sendVictoryAndDefeatShowEvents (victoryPlayerId: string, defeatPlayerId:string, victoryPhysicalComponent:Physical, defeatPhysicalComponent:Physical): Promise<void> {
        victoryPhysicalComponent.visible = true
        defeatPhysicalComponent.visible = true
        return Promise.all([
            this.sendEvent(drawEvent(victoryPlayerId, victoryPhysicalComponent)),
            this.sendEvent(drawEvent(defeatPlayerId, defeatPhysicalComponent))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private defeatPlayerIdFromMatchEntityReferenceAndVictoryPlayer (matchEntityReferenceComponent: EntityReference, victoryPlayerId: string) {
        const defeatPlayerId = matchEntityReferenceComponent.retrieveReferences(EntityType.player).find(playerId => playerId !== victoryPlayerId)
        if (defeatPlayerId) return defeatPlayerId
        throw new Error(missingDefeatPlayerId)
    }

    private onNextTurn (gameEvent: GameEvent): Promise<void> {
        const matchPhasingComponent = this.interactWithEntities.retrieveyComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), Phasing)
        const matchEntityReferenceComponent = this.interactWithEntities.retrieveyComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), EntityReference)
        const phaseSequence = this.phasing(this.playerIdFromEntityReferenceComponentPlayerIndex(0, matchEntityReferenceComponent), this.playerIdFromEntityReferenceComponentPlayerIndex(1, matchEntityReferenceComponent)).find(phaseSequence => (
            phaseSequence.currentPhase.phaseType === matchPhasingComponent.currentPhase.phaseType &&
            phaseSequence.currentPhase.currentPlayerId === matchPhasingComponent.currentPhase.currentPlayerId &&
            phaseSequence.currentPhase.currentUnitId === matchPhasingComponent.currentPhase.currentUnitId
        ))
        return phaseSequence
            ? this.onSupportedCurrentPhase(matchPhasingComponent, matchEntityReferenceComponent, phaseSequence.nextPhase, gameEvent)
            : Promise.reject(new Error(currentPhaseNotSupported(matchPhasingComponent)))
    }

    private playerIdFromEntityReferenceComponentPlayerIndex (playerIndex:number, entityReferenceComponent:EntityReference) {
        const playerIdFromPlayablePlayerIndex = entityReferenceComponent.retrieveReferences(EntityType.player).find((player, index) => index === playerIndex)
        if (playerIdFromPlayablePlayerIndex) return playerIdFromPlayablePlayerIndex
        throw new Error(missingPlayerInderOnPlayableComponent(playerIndex))
    }

    private onSupportedCurrentPhase (matchPhasingComponent: Phasing, matchEntityReferenceComponent:EntityReference, nextPhase: Phase, gameEvent:GameEvent):Promise<void> {
        this.updatePhasingComponentCurrentPhaseWithNextPhase(matchPhasingComponent, nextPhase)
        const events:GameEvent[] = this.eventsOnManualPhases(matchPhasingComponent, matchEntityReferenceComponent)
        const autoMoveEvent = this.eventsOnPlacementPhase(matchPhasingComponent, gameEvent)
        if (autoMoveEvent) events.push(autoMoveEvent)
        return this.sendEvents(events)
    }

    private eventsOnManualPhases (matchPhasingComponent: Phasing, matchEntityReferenceComponent:EntityReference):GameEvent[] {
        const gameEvents:GameEvent[] = []
        if (matchPhasingComponent.currentPhase.phaseType === PhaseType.Fight)
            matchEntityReferenceComponent.retrieveReferences(EntityType.player).forEach(player => {
                const nextTurnButtonId = this.interactWithEntities.retrieveyComponentByEntityId(player, EntityReference).retrieveReference(EntityType.nextTurnButton)
                const nextTurnButtonPhysicalComponent = this.interactWithEntities.retrieveyComponentByEntityId(nextTurnButtonId, Physical)
                nextTurnButtonPhysicalComponent.visible = player === matchPhasingComponent.currentPhase.currentPlayerId
                gameEvents.push(drawEvent(player, nextTurnButtonPhysicalComponent))
            })
        return gameEvents
    }

    private eventsOnPlacementPhase (matchPhasingComponent: Phasing, gameEvent:GameEvent):GameEvent|undefined {
        return (matchPhasingComponent.currentPhase.phaseType === PhaseType.Placement)
            ? (matchPhasingComponent.currentPhase.currentPlayerId && matchPhasingComponent.currentPhase.currentUnitId)
                ? this.sendMoveToPositionEvent(gameEvent, matchPhasingComponent.currentPhase.currentPlayerId, matchPhasingComponent.currentPhase.currentUnitId)
                : undefined
            : undefined
    }

    private updatePhasingComponentCurrentPhaseWithNextPhase (matchPhasingComponent: Phasing, nextPhase: Phase) {
        matchPhasingComponent.currentPhase = nextPhase
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

    private sendMoveToPositionEvent (gameEvent: GameEvent, currentPlayerId:string, currentUnitId:string): GameEvent {
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        const matchEntityReference = this.entityReferencesByEntityId(matchId)
        const entityType = this.entityTypeFromPlayerUnits(currentPlayerId, currentUnitId)
        const matchEntityReferenceComponent = this.interactWithEntities.retrieveyComponentByEntityId(matchId, EntityReference)
        const gridId = matchEntityReference.retrieveReference(EntityType.grid)
        const gridDimensionalComponent = this.interactWithEntities.retrieveyComponentByEntityId(gridId, Dimensional)
        return moveEvent(
            currentPlayerId,
            entityType,
            currentUnitId,
            this.retrieveCellIdWithPosition(
                this.initialPositionFromEntityTypeAndMatchPlayer(entityType, this.playerIndexOnMatch(matchEntityReferenceComponent, currentPlayerId), gridDimensionalComponent.dimensions, this.retrieveGridFirstCellPosition(gridId)),
                matchEntityReference.retrieveReference(EntityType.grid)
            )
        )
    }

    private retrieveGridFirstCellPosition (gridId: string): Position {
        const cellIds = this.interactWithEntities.retrieveyComponentByEntityId(gridId, EntityReference).retrieveReferences(EntityType.cell)
        const cellpositions = cellIds.map(cellId => this.interactWithEntities.retrieveyComponentByEntityId(cellId, Physical).position)
        let gridFirstCellPosition = cellpositions[0]
        for (let index = 1; index < cellpositions.length; index++)
            if (cellpositions[index].x <= gridFirstCellPosition.x && cellpositions[index].y <= gridFirstCellPosition.y)
                gridFirstCellPosition = cellpositions[index]
        return gridFirstCellPosition
    }

    private playerIndexOnMatch (entityReferenceComponent: EntityReference, playerId:string): number {
        return entityReferenceComponent.retrieveReferences(EntityType.player).findIndex(player => player === playerId)
    }

    private entityTypeFromPlayerUnits (currentPlayerId: string, currentUnitId: string):EntityType {
        const playerEntityReference = this.entityReferencesByEntityId(currentPlayerId)
        const towerFound = playerEntityReference.retrieveReferences(EntityType.tower).some(towerId => towerId === currentUnitId)
        if (towerFound) return EntityType.tower
        const robotFound = playerEntityReference.retrieveReferences(EntityType.robot).some(robotId => robotId === currentUnitId)
        if (robotFound) return EntityType.robot
        throw new Error(unitMissingOnPlayerTowersAndRobots(currentUnitId))
    }

    private retrieveCellIdWithPosition (position:Position, gridId:string): string {
        const cellPhysicalComponent = this.entityReferencesByEntityId(gridId)
            .retrieveReferences(EntityType.cell)
            .map(cellId => this.interactWithEntities.retrieveyComponentByEntityId(cellId, Physical))
            .find(cellPhysicalComponent => cellPhysicalComponent.position.x === position.x && cellPhysicalComponent.position.y === position.y)
        if (cellPhysicalComponent) return cellPhysicalComponent.entityId
        throw new Error(cellMissingOnGrid(position, gridId))
    }

    private onReady (gameEvent: GameEvent): Promise<void> {
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        const matchPhasingComponent = this.interactWithEntities.retrieveyComponentByEntityId(matchId, Phasing)
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        matchPhasingComponent.readyPlayers.add(playerId)
        const events:GameEvent[] = [
            ...this.hideAndDestroySimpleMatchLobbyMenuEvents(playerId)
        ]
        if (matchPhasingComponent.readyPlayers.size === 2) events.push(nextTurnEvent(matchId))
        return this.sendEvents(events)
    }

    private hideAndDestroySimpleMatchLobbyMenuEvents (playerId: string): GameEvent[] {
        const playerSimpleMatchLobbyMenu = this.interactWithEntities.retrieveyComponentByEntityId(playerId, EntityReference).retrieveReference(EntityType.simpleMatchLobbyMenu)
        const physicalComponent = this.interactWithEntities.retrieveyComponentByEntityId(playerSimpleMatchLobbyMenu, Physical)
        physicalComponent.visible = false
        return [
            drawEvent(playerId, physicalComponent),
            destroySimpleMatchLobbyMenuEvent(playerSimpleMatchLobbyMenu)
        ]
    }

    private phasing (playerAId:string, playerBId:string):PhaseSequence[] {
        const playerAEntityReference = this.entityReferencesByEntityId(playerAId)
        const playerBEntityReference = this.entityReferencesByEntityId(playerBId)
        const playerARobotId = playerAEntityReference.retrieveReference(EntityType.robot)
        const playerATowerId = playerAEntityReference.retrieveReference(EntityType.tower)
        const playerBRobotId = playerBEntityReference.retrieveReference(EntityType.robot)
        const PlayerBTowerId = playerBEntityReference.retrieveReference(EntityType.tower)
        return [
            { currentPhase: preparingGamePhase, nextPhase: placementPhase(playerAId, playerATowerId, true) },
            { currentPhase: placementPhase(playerAId, playerATowerId, true), nextPhase: placementPhase(playerAId, playerARobotId, true) },
            { currentPhase: placementPhase(playerAId, playerARobotId, true), nextPhase: placementPhase(playerBId, PlayerBTowerId, true) },
            { currentPhase: placementPhase(playerBId, PlayerBTowerId, true), nextPhase: placementPhase(playerBId, playerBRobotId, true) },
            { currentPhase: placementPhase(playerBId, playerBRobotId, true), nextPhase: fightPhase(playerAId, playerARobotId) },
            { currentPhase: fightPhase(playerAId, playerARobotId), nextPhase: fightPhase(playerBId, playerBRobotId) },
            { currentPhase: fightPhase(playerBId, playerBRobotId), nextPhase: fightPhase(playerAId, playerATowerId) },
            { currentPhase: fightPhase(playerAId, playerATowerId), nextPhase: fightPhase(playerBId, PlayerBTowerId) },
            { currentPhase: fightPhase(playerBId, PlayerBTowerId), nextPhase: fightPhase(playerAId, playerARobotId) }
        ]
    }
}
