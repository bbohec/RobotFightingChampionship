import { EntityType } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import { errorMessageOnUnknownEventAction, type GameEvent } from '../../type/GameEvent'
import { GenericGameEventDispatcherSystem } from '../system'
import { AttackingSystem } from './AttackingSystem'
import { CollisionSystem } from './CollisionSystem'
import { HitSystem } from './HitSystem'
import { LoopSystem } from './LoopSystem'
import { MovingSystem } from './MovingSystem'
import { PhasingSystem } from './PhasingSystem'
import { PlayerSystem } from './PlayerSystem'
import { ServerLifeCycleSystem } from './ServerLifeCycleSystem'
import { ServerMatchSystem } from './ServerMatchSystem'
import { WaitingAreaSystem } from './WaitingAreaSystem'

export class ServerGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
  onGameEvent(gameEvent: GameEvent): Promise<void> {
    return gameEvent.action === EventKind.draw || gameEvent.action === EventKind.notifyPlayer
      ? this.sendEventToClient(gameEvent)
      : gameEvent.action === EventKind.create || gameEvent.action === EventKind.destroy
        ? this.interactWithSystems
            .retrieveSystemByClass(ServerLifeCycleSystem)
            .onGameEvent(gameEvent)
        : (gameEvent.action === EventKind.join &&
              this.hasEntitiesByEntityType(gameEvent, EntityType.simpleMatchLobby)) ||
            gameEvent.action === EventKind.waitingForPlayers
          ? this.interactWithSystems.retrieveSystemByClass(WaitingAreaSystem).onGameEvent(gameEvent)
          : gameEvent.action === EventKind.join || gameEvent.action === EventKind.quit
            ? this.interactWithSystems
                .retrieveSystemByClass(ServerMatchSystem)
                .onGameEvent(gameEvent)
            : gameEvent.action === EventKind.register
              ? this.onRegister(gameEvent)
              : gameEvent.action === EventKind.ready ||
                  gameEvent.action === EventKind.nextTurn ||
                  gameEvent.action === EventKind.victory
                ? this.interactWithSystems
                    .retrieveSystemByClass(PhasingSystem)
                    .onGameEvent(gameEvent)
                : gameEvent.action === EventKind.newLoop
                  ? this.interactWithSystems
                      .retrieveSystemByClass(LoopSystem)
                      .onGameEvent(gameEvent)
                  : gameEvent.action === EventKind.hit
                    ? this.interactWithSystems
                        .retrieveSystemByClass(HitSystem)
                        .onGameEvent(gameEvent)
                    : gameEvent.action === EventKind.move ||
                        gameEvent.action === EventKind.updatePlayerPointerState
                      ? this.interactWithSystems
                          .retrieveSystemByClass(MovingSystem)
                          .onGameEvent(gameEvent)
                      : gameEvent.action === EventKind.attack
                        ? this.interactWithSystems
                            .retrieveSystemByClass(AttackingSystem)
                            .onGameEvent(gameEvent)
                        : gameEvent.action === EventKind.checkCollision ||
                            gameEvent.action === EventKind.collision
                          ? this.interactWithSystems
                              .retrieveSystemByClass(CollisionSystem)
                              .onGameEvent(gameEvent)
                          : gameEvent.action === EventKind.notifyServer
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  errorMessageOnUnknownEventAction(
                                    ServerGameEventDispatcherSystem.name,
                                    gameEvent,
                                  ),
                                ),
                              )
  }

  onRegister(gameEvent: GameEvent): Promise<void> {
    const isGameEventHasEntityType = (gameEvent: GameEvent, entityType: EntityType) =>
      this.allEntityTypes(gameEvent).some(
        (gameEventEntityType) => gameEventEntityType === entityType,
      )
    const includesGrid = isGameEventHasEntityType(gameEvent, EntityType.grid)
    const includesRobot = isGameEventHasEntityType(gameEvent, EntityType.robot)
    const includesTower = isGameEventHasEntityType(gameEvent, EntityType.tower)
    const includesPlayer = isGameEventHasEntityType(gameEvent, EntityType.player)
    const includesGame = isGameEventHasEntityType(gameEvent, EntityType.game)
    const includesPointer = isGameEventHasEntityType(gameEvent, EntityType.pointer)
    const includesMatch = isGameEventHasEntityType(gameEvent, EntityType.match)
    return includesPlayer && includesPointer
      ? this.sendEventToClient(gameEvent)
      : includesPlayer && includesGame
        ? this.interactWithSystems.retrieveSystemByClass(PlayerSystem).onGameEvent(gameEvent)
        : includesPlayer && !includesGrid && !includesRobot && !includesTower && !includesMatch
          ? this.interactWithSystems
              .retrieveSystemByClass(ServerLifeCycleSystem)
              .onGameEvent(gameEvent)
          : this.interactWithSystems.retrieveSystemByClass(ServerMatchSystem).onGameEvent(gameEvent)
  }
}
