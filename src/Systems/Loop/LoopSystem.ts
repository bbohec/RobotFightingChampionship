import { Action } from '../../Event/Action'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { checkCollisionGameEvent } from '../../Events/checkCollision/checkCollision'
import { GenericServerSystem } from '../Generic/GenericServerSystem'

export class LoopSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.newLoop) return this.onNewLoop(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(LoopSystem.name, gameEvent))
    }

    onNewLoop (gameEvent: GameEvent): Promise<void> {
        return this.sendEvent(checkCollisionGameEvent())
    }
}
