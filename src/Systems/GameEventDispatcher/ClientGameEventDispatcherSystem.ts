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
