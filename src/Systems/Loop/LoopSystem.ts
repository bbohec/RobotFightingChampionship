import { Action } from '../../core/type/Action'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../core/type/GameEvent'
import { checkCollisionGameEvent } from '../../core/events/checkCollision/checkCollision'
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
