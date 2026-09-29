import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { DrawingSystem } from './DrawingSystem'
import { EventKind } from '../../type/EventKind'
import { ClientLifeCycleSystem } from './ClientLifeCycleSystem'
import { ControllerSystem } from './ControllerSystem'
import { EntityType } from '../../ecs/components/EntityReference'
import { NotificationSystem } from './NotificationSystem'
import { GenericGameEventDispatcherSystem } from '../system'

export class ClientGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === EventKind.create
            ? this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent)
            : gameEvent.action === EventKind.updatePlayerPointerPosition
                ? this.interactWithSystems.retrieveSystemByClass(ControllerSystem).onGameEvent(gameEvent)
                : gameEvent.action === EventKind.updatePlayerPointerState
                    ? this.sendEventToServer(gameEvent)
                    : gameEvent.action === EventKind.register
                        ? this.onRegister(gameEvent)
                        : gameEvent.action === EventKind.activate
                            ? this.interactWithSystems.retrieveSystemByClass(ControllerSystem).onGameEvent(gameEvent)
                            : gameEvent.action === EventKind.notifyPlayer
                                ? this.interactWithSystems.retrieveSystemByClass(NotificationSystem).onGameEvent(gameEvent)
                                : gameEvent.action === EventKind.draw
                                    ? this.interactWithSystems.retrieveSystemByClass(DrawingSystem).onGameEvent(gameEvent)
                                    : Promise.reject(new Error(errorMessageOnUnknownEventAction(ClientGameEventDispatcherSystem.name, gameEvent)))
    }

    private onRegister (gameEvent: GameEvent): Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.player) && this.hasEntitiesByEntityType(gameEvent, EntityType.pointer)
            ? this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent)
            : this.sendEventToServer(gameEvent)
    }
}
