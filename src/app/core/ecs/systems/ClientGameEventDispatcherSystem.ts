import { EntityType } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import { errorMessageOnUnknownEventAction, type GameEvent } from '../../type/GameEvent'
import { GenericGameEventDispatcherSystem } from '../system'
import { ClientLifeCycleSystem } from './ClientLifeCycleSystem'
import { ControllerSystem } from './ControllerSystem'
import { DrawingSystem } from './DrawingSystem'
import { NotificationSystem } from './NotificationSystem'

export class ClientGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
  onGameEvent(gameEvent: GameEvent): Promise<void> {
    return gameEvent.action === EventKind.create
      ? this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent)
      : gameEvent.action === EventKind.updatePlayerPointerPosition
        ? this.interactWithSystems.retrieveSystemByClass(ControllerSystem).onGameEvent(gameEvent)
        : gameEvent.action === EventKind.updatePlayerPointerState
          ? this.sendEventToServer(gameEvent)
          : gameEvent.action === EventKind.register
            ? this.onRegister(gameEvent)
            : gameEvent.action === EventKind.activate
              ? this.interactWithSystems
                  .retrieveSystemByClass(ControllerSystem)
                  .onGameEvent(gameEvent)
              : gameEvent.action === EventKind.notifyPlayer
                ? this.interactWithSystems
                    .retrieveSystemByClass(NotificationSystem)
                    .onGameEvent(gameEvent)
                : gameEvent.action === EventKind.draw
                  ? this.interactWithSystems
                      .retrieveSystemByClass(DrawingSystem)
                      .onGameEvent(gameEvent)
                  : Promise.reject(
                      new Error(
                        errorMessageOnUnknownEventAction(
                          ClientGameEventDispatcherSystem.name,
                          gameEvent,
                        ),
                      ),
                    )
  }

  private onRegister(gameEvent: GameEvent): Promise<void> {
    return this.hasEntitiesByEntityType(gameEvent, EntityType.player) &&
      this.hasEntitiesByEntityType(gameEvent, EntityType.pointer)
      ? this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent)
      : this.sendEventToServer(gameEvent)
  }
}
