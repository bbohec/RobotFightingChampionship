import { Phasing } from '../../Component/Phasing'
import { Phase } from '../../Component/port/Phase'
import { Action } from '../../Events/port/Action'
import { GameEvent } from '../../Events/port/GameEvent'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId, MissingTargetEntityId } from '../../Events/port/GameEvents'
import { GenericSystem } from '../Generic/GenericSystem'
export class PhasingSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.ready) return this.onReady(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(PhasingSystem.name, gameEvent))
    }

    private onReady (gameEvent: GameEvent): Promise<void> {
        if (!gameEvent.originEntityId) throw new Error(MissingOriginEntityId)
        if (!gameEvent.targetEntityId) throw new Error(MissingTargetEntityId)
        const matchPhasingComponent = this.interactWithEntities.retrieveEntityById(gameEvent.targetEntityId).retrieveComponent(Phasing)
        matchPhasingComponent.readyPlayers.add(gameEvent.originEntityId)
        if (matchPhasingComponent.readyPlayers.size === 2) matchPhasingComponent.currentPhase = Phase.PlayerA
        return Promise.resolve()
    }
}
