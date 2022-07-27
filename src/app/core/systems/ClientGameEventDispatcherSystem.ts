import { errorMessageOnUnknownEventAction, GameEvent } from '../type/GameEvent'
import { DrawingSystem } from './DrawingSystem'
import { GenericGameEventDispatcherSystem } from '../system/GenericGameEventDispatcherSystem'
import { Action } from '../type/Action'
import { ClientLifeCycleSystem } from './ClientLifeCycleSystem'
import { ControllerSystem } from './ControllerSystem'
import { EntityType } from '../type/EntityType'
import { NotificationSystem } from './NotificationSystem'
export class ClientGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === Action.create
            ? this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent)
            : gameEvent.action === Action.updatePlayerPointerPosition
                ? this.interactWithSystems.retrieveSystemByClass(ControllerSystem).onGameEvent(gameEvent)
                : gameEvent.action === Action.updatePlayerPointerState
                    ? this.sendEventToServer(gameEvent)
                    : gameEvent.action === Action.register
                        ? this.onRegister(gameEvent)
                        : gameEvent.action === Action.activate
                            ? this.interactWithSystems.retrieveSystemByClass(ControllerSystem).onGameEvent(gameEvent)
                            : gameEvent.action === Action.notifyPlayer
                                ? this.interactWithSystems.retrieveSystemByClass(NotificationSystem).onGameEvent(gameEvent)
                                : gameEvent.action === Action.draw
                                    ? this.interactWithSystems.retrieveSystemByClass(DrawingSystem).onGameEvent(gameEvent)
                                    : Promise.reject(new Error(errorMessageOnUnknownEventAction(ClientGameEventDispatcherSystem.name, gameEvent)))
    }

    private onRegister (gameEvent: GameEvent): Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.player) && this.hasEntitiesByEntityType(gameEvent, EntityType.pointer)
            ? this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent)
            : this.sendEventToServer(gameEvent)
    }
}
