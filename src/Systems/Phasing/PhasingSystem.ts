import { fightPhase, Phasing, placementPhase, preparingGamePhase, victoryPhase } from '../../Components/Phasing'
import { Phase, PhaseType } from '../../Components/port/Phase'
import { nextTurnEvent } from '../../Events/nextTurn/nextTurn'
import { Action } from '../../Event/Action'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { EntityType } from '../../Event/EntityType'
import { Playable } from '../../Components/Playable'
import { showEvent } from '../../Events/show/show'
import { Physical, playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition, Position } from '../../Components/Physical'
import { moveEvent } from '../../Events/move/move'
import { cellMissingOnGrid, currentPhaseNotSupported, missingDefeatPlayerId, missingInitialPosition, missingPlayerInderOnPlayableComponent, unitMissingOnPlayerTowersAndRobots, victoryPlayerMissingOnPlayableComponent } from './port/phasingSystem'
import { EntityId } from '../../Event/entityIds'

export interface PhaseSequence {
    currentPhase:Phase,
    nextPhase:Phase
}

export class PhasingSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.ready) return this.onReady(gameEvent)
        if (gameEvent.action === Action.nextTurn) return this.onNextTurn(gameEvent)
        if (gameEvent.action === Action.victory) return this.onVictory(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(PhasingSystem.name, gameEvent))
    }

    private onVictory (gameEvent: GameEvent): Promise<void> {
        const playableComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), Playable)
        const victoryPlayerId = gameEvent.entityByEntityType(EntityType.player)
        this.applyVictoryPhaseOnPhasingComponent(
            playableComponent,
            victoryPlayerId,
            this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), Phasing)
        )
        return this.sendVictoryAndDefeatShowEvents(playableComponent, victoryPlayerId)
    }

    private applyVictoryPhaseOnPhasingComponent (playableComponent: Playable, victoryPlayerId: string, phasingComponent: Phasing) {
        const playerId = playableComponent.players.find(playerId => playerId === victoryPlayerId)
        if (!playerId) throw new Error(victoryPlayerMissingOnPlayableComponent(victoryPlayerId))
        phasingComponent.currentPhase = victoryPhase(playerId)
    }

    private sendVictoryAndDefeatShowEvents (playableComponent: Playable, victoryPlayerId: string): Promise<void> {
        return Promise.all([
            this.sendEvent(showEvent(EntityType.victory, EntityId.victory, victoryPlayerId, this.interactWithEntities.retrieveEntityComponentByEntityId(EntityId.victory, Physical))),
            this.sendEvent(showEvent(EntityType.defeat, EntityId.defeat, this.defeatPlayerIdFromPlayableComponentAndVictoryPlayer(playableComponent, victoryPlayerId), this.interactWithEntities.retrieveEntityComponentByEntityId(EntityId.defeat, Physical)))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private defeatPlayerIdFromPlayableComponentAndVictoryPlayer (playableComponent: Playable, victoryPlayerId: string) {
        const defeatPlayerId = playableComponent.players.find(playerId => playerId !== victoryPlayerId)
        if (defeatPlayerId) return defeatPlayerId
        throw new Error(missingDefeatPlayerId)
    }

    private onNextTurn (gameEvent: GameEvent): Promise<void> {
        const matchPhasingComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), Phasing)
        const playableComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), Playable)
        const phaseSequence = this.phasing(this.playerIdFromPlayableComponentPlayerIndex(0, playableComponent), this.playerIdFromPlayableComponentPlayerIndex(1, playableComponent)).find(phaseSequence => (
            phaseSequence.currentPhase.phaseType === matchPhasingComponent.currentPhase.phaseType &&
            phaseSequence.currentPhase.currentPlayerId === matchPhasingComponent.currentPhase.currentPlayerId &&
            phaseSequence.currentPhase.currentUnitId === matchPhasingComponent.currentPhase.currentUnitId
        ))
        if (phaseSequence) return this.onSupportedCurrentPhase(matchPhasingComponent, phaseSequence.nextPhase, gameEvent)
        throw new Error(currentPhaseNotSupported(matchPhasingComponent))
    }

    private playerIdFromPlayableComponentPlayerIndex (playerIndex:number, playableComponent:Playable) {
        const playerIdFromPlayablePlayerIndex = playableComponent.players.find((player, index) => index === playerIndex)
        if (playerIdFromPlayablePlayerIndex) return playerIdFromPlayablePlayerIndex
        throw new Error(missingPlayerInderOnPlayableComponent(playerIndex))
    }

    private onSupportedCurrentPhase (matchPhasingComponent: Phasing, nextPhase: Phase, gameEvent:GameEvent):Promise<void> {
        this.updatePhasingComponentCurrentPhaseWithNextPhase(matchPhasingComponent, nextPhase)
        return (matchPhasingComponent.currentPhase.phaseType === PhaseType.Placement)
            ? this.onAutomatedPlayablePhase(matchPhasingComponent.currentPhase, gameEvent)
            : Promise.resolve()
    }

    private updatePhasingComponentCurrentPhaseWithNextPhase (matchPhasingComponent: Phasing, nextPhase: Phase) {
        matchPhasingComponent.currentPhase = nextPhase
    }

    private onAutomatedPlayablePhase (phase :Phase, gameEvent: GameEvent): Promise<void> {
        return (phase.currentPlayerId && phase.currentUnitId)
            ? this.sendMoveToPositionEvent(gameEvent, phase.currentPlayerId, phase.currentUnitId)
                .then(() => this.sendNextTurnEvent(gameEvent.entityByEntityType(EntityType.match)))
                .catch(error => Promise.reject(error))
            : Promise.resolve()
    }

    private initialPositionFromEntityTypeAndMatchPlayer (entityType:EntityType, playerIndex:number):Position {
        const positionsMapping :{entityType:EntityType, playerIndex:number, position:Position}[] = [
            { entityType: EntityType.tower, playerIndex: 0, position: playerATowerFirstPosition },
            { entityType: EntityType.robot, playerIndex: 0, position: playerARobotFirstPosition },
            { entityType: EntityType.tower, playerIndex: 1, position: playerBTowerFirstPosition },
            { entityType: EntityType.robot, playerIndex: 1, position: playerBRobotFirstPosition }
        ]
        const positionMapping = positionsMapping.find(positionMapping => (
            positionMapping.entityType === entityType &&
            positionMapping.playerIndex === playerIndex
        ))
        if (positionMapping) return positionMapping.position
        throw new Error(missingInitialPosition(entityType, playerIndex))
    }

    private sendMoveToPositionEvent (gameEvent: GameEvent, currentPlayerId:string, currentUnitId:string): Promise<void> {
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        const matchEntityReference = this.entityReferencesByEntityId(matchId)
        const entityType = this.entityTypeFromPlayerUnits(currentPlayerId, currentUnitId)
        const playableComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(EntityId.match, Playable)
        return this.sendEvent(moveEvent(
            currentPlayerId,
            entityType,
            currentUnitId,
            this.retrieveCellIdWithPosition(
                this.initialPositionFromEntityTypeAndMatchPlayer(entityType, this.playerIndexOnMatch(playableComponent, currentPlayerId)),
                matchEntityReference.retreiveReference(EntityType.grid)
            )
        ))
    }

    private playerIndexOnMatch (playableComponent: Playable, playerId:string): number {
        return playableComponent.players.findIndex(player => player === playerId)
    }

    private entityTypeFromPlayerUnits (currentPlayerId: string, currentUnitId: string):EntityType {
        const playerEntityReference = this.entityReferencesByEntityId(currentPlayerId)
        const towerFound = playerEntityReference.retrieveReferences(EntityType.tower).some(towerId => towerId === currentUnitId)
        if (towerFound) return EntityType.tower
        const robotFound = playerEntityReference.retrieveReferences(EntityType.robot).some(robotId => robotId === currentUnitId)
        if (robotFound) return EntityType.robot
        throw new Error(unitMissingOnPlayerTowersAndRobots(currentUnitId))
    }

    private sendNextTurnEvent (matchId:string): Promise<void> {
        return this.sendEvent(nextTurnEvent(matchId))
    }

    private retrieveCellIdWithPosition (position:Position, gridId:string): string {
        const cellPhysicalComponent = this.entityReferencesByEntityId(gridId)
            .retrieveReferences(EntityType.cell)
            .map(cellId => this.interactWithEntities.retrieveEntityComponentByEntityId(cellId, Physical))
            .find(cellPhysicalComponent => cellPhysicalComponent.position.x === position.x && cellPhysicalComponent.position.y === position.y)
        if (cellPhysicalComponent) return cellPhysicalComponent.entityId
        throw new Error(cellMissingOnGrid(position, gridId))
    }

    private onReady (gameEvent: GameEvent): Promise<void> {
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        const matchPhasingComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(matchId, Phasing)
        matchPhasingComponent.readyPlayers.add(gameEvent.entityByEntityType(EntityType.player))
        return (matchPhasingComponent.readyPlayers.size === 2)
            ? this.sendEvent(nextTurnEvent(matchId))
            : Promise.resolve()
    }

    private phasing (playerAId:string, playerBId:string):PhaseSequence[] {
        const playerAEntityReference = this.entityReferencesByEntityId(playerAId)
        const playerBEntityReference = this.entityReferencesByEntityId(playerBId)
        const playerARobotId = playerAEntityReference.retreiveReference(EntityType.robot)
        const playerATowerId = playerAEntityReference.retreiveReference(EntityType.tower)
        const playerBRobotId = playerBEntityReference.retreiveReference(EntityType.robot)
        const PlayerBTowerId = playerBEntityReference.retreiveReference(EntityType.tower)
        return [
            { currentPhase: preparingGamePhase, nextPhase: placementPhase(playerAId, playerATowerId) },
            { currentPhase: placementPhase(playerAId, playerATowerId), nextPhase: placementPhase(playerAId, playerARobotId) },
            { currentPhase: placementPhase(playerAId, playerARobotId), nextPhase: placementPhase(playerBId, PlayerBTowerId) },
            { currentPhase: placementPhase(playerBId, PlayerBTowerId), nextPhase: placementPhase(playerBId, playerBRobotId) },
            { currentPhase: placementPhase(playerBId, playerBRobotId), nextPhase: fightPhase(playerAId, playerARobotId) },
            { currentPhase: fightPhase(playerAId, playerARobotId), nextPhase: fightPhase(playerBId, playerBRobotId) },
            { currentPhase: fightPhase(playerBId, playerBRobotId), nextPhase: fightPhase(playerAId, playerATowerId) },
            { currentPhase: fightPhase(playerAId, playerATowerId), nextPhase: fightPhase(playerBId, PlayerBTowerId) },
            { currentPhase: fightPhase(playerBId, PlayerBTowerId), nextPhase: fightPhase(playerAId, playerARobotId) }
        ]
    }
}
