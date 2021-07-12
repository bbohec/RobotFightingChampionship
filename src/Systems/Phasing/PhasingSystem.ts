import { Phasing } from '../../Components/Phasing'
import { PhaseType } from '../../Components/port/Phase'
import { nextTurnEvent } from '../../Events/nextTurn/nextTurnEvent'
import { Action } from '../../Event/Action'
import { errorMessageOnUnknownEventAction, GameEvent, MissingOriginEntityId, MissingTargetEntityId } from '../../Event/GameEvent'
import { GenericSystem } from '../Generic/GenericSystem'
export class PhasingSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.ready) return this.onReady(gameEvent)
        if (gameEvent.action === Action.nextTurn) return this.onNextTurn(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(PhasingSystem.name, gameEvent))
    }

    onNextTurn (gameEvent: GameEvent): Promise<void> {
        if (!gameEvent.targetEntityId) throw new Error(MissingTargetEntityId)
        const matchPhasingComponent = this.interactWithEntities.retrieveEntityById(gameEvent.targetEntityId).retrieveComponent(Phasing)
        const nextPhase = this.phasing.get(matchPhasingComponent.currentPhase)
        if (nextPhase) return this.onSupportedCurrentPhase(matchPhasingComponent, nextPhase)
        throw new Error(`Current phase '${matchPhasingComponent.currentPhase}' not supported for next turn.`)
    }

    private onSupportedCurrentPhase (matchPhasingComponent: Phasing, nextPhase: PhaseType):Promise<void> {
        matchPhasingComponent.currentPhase = nextPhase
        return Promise.resolve()
    }

    private onReady (gameEvent: GameEvent): Promise<void> {
        if (!gameEvent.originEntityId) throw new Error(MissingOriginEntityId)
        if (!gameEvent.targetEntityId) throw new Error(MissingTargetEntityId)
        const matchPhasingComponent = this.interactWithEntities.retrieveEntityById(gameEvent.targetEntityId).retrieveComponent(Phasing)
        matchPhasingComponent.readyPlayers.add(gameEvent.originEntityId)
        return (matchPhasingComponent.readyPlayers.size === 2)
            ? this.sendEvent(nextTurnEvent(gameEvent.targetEntityId))
            : Promise.resolve()
    }

    private phasing:Map<PhaseType, PhaseType> = new Map([
        [PhaseType.PlayerATowerPlacement, PhaseType.PlayerARobotPlacement],
        [PhaseType.PlayerARobotPlacement, PhaseType.PlayerBTowerPlacement],
        [PhaseType.PlayerBTowerPlacement, PhaseType.PlayerBRobotPlacement],
        [PhaseType.PlayerBRobotPlacement, PhaseType.PlayerARobot],
        [PhaseType.PlayerARobot, PhaseType.PlayerBRobot],
        [PhaseType.PlayerBRobot, PhaseType.PlayerATower],
        [PhaseType.PlayerATower, PhaseType.PlayerBTower],
        [PhaseType.PlayerBTower, PhaseType.PlayerARobot]
    ])
}
