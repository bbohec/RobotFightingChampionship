import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { DrawingSystem } from '../Drawing/DrawingSystem'
import { GenericGameEventDispatcherSystem } from './GenericGameEventDispatcherSystem'
import { Action } from '../../Event/Action'
import { ClientLifeCycleSystem } from '../LifeCycle/ClientLifeCycleSystem'
import { ControllerSystem } from '../Controller/ControllerSystem'
import { EntityType } from '../../Event/EntityType'
import { NotificationSystem } from '../Notification/NotificationSystem'
export class ClientGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.create) return this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.updatePlayerPointerPosition) return this.interactWithSystems.retrieveSystemByClass(ControllerSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.updatePlayerPointerState) return this.sendEventToServer(gameEvent)
        if (gameEvent.action === Action.register) return this.onRegister(gameEvent)
        if (gameEvent.action === Action.activate) return this.interactWithSystems.retrieveSystemByClass(ControllerSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.notify) return this.interactWithSystems.retrieveSystemByClass(NotificationSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.draw) return this.interactWithSystems.retrieveSystemByClass(DrawingSystem).onGameEvent(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ClientGameEventDispatcherSystem.name, gameEvent))
    }

    private onRegister (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.player) && gameEvent.hasEntitiesByEntityType(EntityType.pointer))
            return this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent)
        return this.sendEventToServer(gameEvent)
    }
}
