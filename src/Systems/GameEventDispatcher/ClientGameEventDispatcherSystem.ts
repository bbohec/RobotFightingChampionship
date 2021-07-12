import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { ClientLifeCycleSystem } from '../LifeCycle/ClientLifeCycleSystem'
import { DrawingSystem } from '../Drawing/DrawingSystem'
import { GenericGameEventDispatcherSystem } from './GenericGameEventDispatcherSystem'
import { ClientMatchSystem } from '../Match/ClientMatchSystem'
import { Action } from '../../Event/Action'

export class ClientGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.create) return this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.join) return this.interactWithSystems.retrieveSystemByClass(ClientMatchSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.show || gameEvent.action === Action.hide) return this.interactWithSystems.retrieveSystemByClass(DrawingSystem).onGameEvent(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ClientGameEventDispatcherSystem.name, gameEvent))
    }
}
