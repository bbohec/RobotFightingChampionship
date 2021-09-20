import { Phasing, playerARobotPhase, playerARobotPlacementPhase, playerATowerPhase, playerATowerPlacementPhase, playerAVictoryPhase, playerBRobotPhase, playerBRobotPlacementPhase, playerBTowerPhase, playerBTowerPlacementPhase, playerBVictoryPhase, preparingGamePhase } from '../../Components/Phasing'
import { MatchPlayer, Phase, PhaseType } from '../../Components/port/Phase'
import { nextTurnEvent } from '../../Events/nextTurn/nextTurn'
import { Action } from '../../Event/Action'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericSystem } from '../Generic/GenericSystem'
import { EntityType } from '../../Event/EntityType'
import { Playable } from '../../Components/Playable'
import { showEvent } from '../../Events/show/show'
import { defeatEntityId, victoryEntityId } from '../../Event/entityIds'
import { Physical, playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition, Position } from '../../Components/Physical'
import { moveEvent } from '../../Events/move/move'
import { cellMissingOnGrid, currentPhaseNotSupported, missingDefeatPlayerId, missingInitialPosition } from './port/phasingSystem'

export interface PhaseSequence {
    currentPhase:Phase,
    nextPhase:Phase
}

export class PhasingSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.ready) return this.onReady(gameEvent)
        if (gameEvent.action === Action.nextTurn) return this.onNextTurn(gameEvent)
        if (gameEvent.action === Action.victory) return this.onVictory(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(PhasingSystem.name, gameEvent))
    }

    private onVictory (gameEvent: GameEvent): Promise<void> {
        const playableComponent = this.interactWithEntities.retrieveEntityById(gameEvent.entityByEntityType(EntityType.match)).retrieveComponent(Playable)
        const victoryPlayerId = gameEvent.entityByEntityType(EntityType.player)
        this.applyVictoryPhaseOnPhasingComponent(
            playableComponent,
            victoryPlayerId,
            this.interactWithEntities
                .retrieveEntityById(gameEvent.entityByEntityType(EntityType.match))
                .retrieveComponent(Phasing)
        )
        return this.sendVictoryAndDefeatShowEvents(playableComponent, victoryPlayerId)
    }

    private applyVictoryPhaseOnPhasingComponent (playableComponent: Playable, victoryPlayerId: string, phasingComponent: Phasing) {
        (playableComponent.players.findIndex(playerId => playerId === victoryPlayerId) === 0)
            ? phasingComponent.currentPhase = playerAVictoryPhase()
            : phasingComponent.currentPhase = playerBVictoryPhase()
    }

    private sendVictoryAndDefeatShowEvents (playableComponent: Playable, victoryPlayerId: string): Promise<void> {
        return Promise.all([
            this.sendEvent(showEvent(EntityType.victory, victoryEntityId, victoryPlayerId)),
            this.sendEvent(showEvent(EntityType.defeat, defeatEntityId, this.defeatPlayerIdFromPlayableComponentAndVictoryPlayer(playableComponent, victoryPlayerId)))
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
        const matchPhasingComponent = this.interactWithEntities.retrieveEntityById(gameEvent.entityByEntityType(EntityType.match)).retrieveComponent(Phasing)
        const phaseSequence = this.phasing.find(phaseSequence => (
            phaseSequence.currentPhase.phaseType === matchPhasingComponent.currentPhase.phaseType &&
            phaseSequence.currentPhase.matchPlayer === matchPhasingComponent.currentPhase.matchPlayer
        ))
        if (phaseSequence) return this.onSupportedCurrentPhase(matchPhasingComponent, phaseSequence.nextPhase, gameEvent)
        throw new Error(currentPhaseNotSupported(matchPhasingComponent))
    }

    private onSupportedCurrentPhase (matchPhasingComponent: Phasing, nextPhase: Phase, gameEvent:GameEvent):Promise<void> {
        matchPhasingComponent.currentPhase = nextPhase
        return (matchPhasingComponent.currentPhase.matchPlayer)
            ? this.onPlayablePhase(matchPhasingComponent.currentPhase.matchPlayer, matchPhasingComponent.currentPhase.phaseType, gameEvent)
            : Promise.resolve()
    }

    private onPlayablePhase (matchPlayer: MatchPlayer, phaseType:PhaseType, gameEvent: GameEvent): Promise<void> {
        const entityTypeFromAutomaticPhaseType:Map<PhaseType, EntityType> = new Map([
            [PhaseType.TowerPlacement, EntityType.tower],
            [PhaseType.RobotPlacement, EntityType.robot]
        ])
        return (entityTypeFromAutomaticPhaseType.has(phaseType))
            ? this.sendMoveToPositionEvent(gameEvent, entityTypeFromAutomaticPhaseType.get(phaseType)!, matchPlayer)
                .then(() => this.sendNextTurnEvent(gameEvent.entityByEntityType(EntityType.match)))
                .catch(error => Promise.reject(error))
            : Promise.resolve()
    }

    private initialPositionFromEntityTypeAndMatchPlayer (entityType:EntityType, matchPlayer:MatchPlayer):Position {
        const positionsMapping :{entityType:EntityType, matchPlayer:MatchPlayer, position:Position}[] = [
            { entityType: EntityType.tower, matchPlayer: MatchPlayer.A, position: playerATowerFirstPosition },
            { entityType: EntityType.robot, matchPlayer: MatchPlayer.A, position: playerARobotFirstPosition },
            { entityType: EntityType.tower, matchPlayer: MatchPlayer.B, position: playerBTowerFirstPosition },
            { entityType: EntityType.robot, matchPlayer: MatchPlayer.B, position: playerBRobotFirstPosition }
        ]
        const positionMapping = positionsMapping.find(positionMapping => (
            positionMapping.entityType === entityType &&
            positionMapping.matchPlayer === matchPlayer
        ))
        if (positionMapping) return positionMapping.position
        throw new Error(missingInitialPosition(entityType, matchPlayer))
    }

    private sendMoveToPositionEvent (gameEvent: GameEvent, entityType:EntityType, matchPlayer:MatchPlayer): Promise<void> {
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        const matchEntityReference = this.entityReferencesByEntityId(matchId)
        const playableComponent = this.interactWithEntities.retrieveEntityById(matchId).retrieveComponent(Playable)
        return this.sendEvent(moveEvent(
            (matchPlayer === MatchPlayer.A) ? playableComponent.players[0] : playableComponent.players[1],
            entityType,
            this.retrievePlayerUnitId(gameEvent, matchPlayer, entityType),
            this.retrieveCellIdWithPosition(gameEvent, this.initialPositionFromEntityTypeAndMatchPlayer(entityType, matchPlayer), matchEntityReference.retreiveReference(EntityType.grid)))
        )
    }

    private sendNextTurnEvent (matchId:string): Promise<void> {
        return this.sendEvent(nextTurnEvent(matchId))
    }

    private retrieveCellIdWithPosition (gameEvent:GameEvent, position:Position, gridId:string): string {
        const cellForPlayerATower = this.entityReferencesByEntityId(gridId)
            .retrieveReferences(EntityType.cell)
            .map(cellId => this.interactWithEntities.retrieveEntityById(cellId))
            .find(cellEntity => cellEntity.retrieveComponent(Physical).position.x === position.x && cellEntity.retrieveComponent(Physical).position.y === position.y)
        if (cellForPlayerATower) return cellForPlayerATower.id
        throw new Error(cellMissingOnGrid(position, gridId))
    }

    private retrievePlayerUnitId (gameEvent: GameEvent, player:MatchPlayer, entityType:EntityType):string {
        const playableComponent = this.interactWithEntities.retrieveEntityById(gameEvent.entityByEntityType(EntityType.match)).retrieveComponent(Playable)
        return this.entityReferencesByEntityId((player === MatchPlayer.A) ? playableComponent.players[0] : playableComponent.players[1])
            .retreiveReference(entityType)
    }

    private onReady (gameEvent: GameEvent): Promise<void> {
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        const matchPhasingComponent = this.interactWithEntities.retrieveEntityById(matchId).retrieveComponent(Phasing)
        matchPhasingComponent.readyPlayers.add(gameEvent.entityByEntityType(EntityType.player))
        return (matchPhasingComponent.readyPlayers.size === 2)
            ? this.sendEvent(nextTurnEvent(matchId))
            : Promise.resolve()
    }

    private phasing:PhaseSequence[] = [
        { currentPhase: preparingGamePhase(), nextPhase: playerATowerPlacementPhase() },
        { currentPhase: playerATowerPlacementPhase(), nextPhase: playerARobotPlacementPhase() },
        { currentPhase: playerARobotPlacementPhase(), nextPhase: playerBTowerPlacementPhase() },
        { currentPhase: playerBTowerPlacementPhase(), nextPhase: playerBRobotPlacementPhase() },
        { currentPhase: playerBRobotPlacementPhase(), nextPhase: playerARobotPhase() },
        { currentPhase: playerARobotPhase(), nextPhase: playerBRobotPhase() },
        { currentPhase: playerBRobotPhase(), nextPhase: playerATowerPhase() },
        { currentPhase: playerATowerPhase(), nextPhase: playerBTowerPhase() },
        { currentPhase: playerBTowerPhase(), nextPhase: playerARobotPhase() }
    ]
}
