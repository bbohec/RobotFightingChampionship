import { EventKind } from '../../type/EventKind'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { checkCollisionGameEvent } from '../../events/checkCollision/checkCollision'
import { GenericServerSystem } from '../system'

export class LoopSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === EventKind.newLoop) return this.onNewLoop(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(LoopSystem.name, gameEvent))
    }

    onNewLoop (gameEvent: GameEvent): Promise<void> {
        return this.sendEvent(checkCollisionGameEvent())
    }
}
