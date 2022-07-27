import { errorMessageOnUnknownEventAction, GameEvent } from '../type/GameEvent'
import { GenericGameEventDispatcherSystem } from '../system/GenericGameEventDispatcherSystem'
import { ServerLifeCycleSystem } from './ServerLifeCycleSystem'
import { WaitingAreaSystem } from './WaitingAreaSystem'
import { ServerMatchSystem } from './ServerMatchSystem'
import { Action } from '../type/Action'
import { PhasingSystem } from './PhasingSystem'
import { EntityType } from '../type/EntityType'
import { HitSystem } from './HitSystem'
import { AttackingSystem } from './AttackingSystem'
import { MovingSystem } from './MovingSystem'
import { CollisionSystem } from './CollisionSystem'
import { PlayerSystem } from './PlayerSystem'
import { LoopSystem } from './LoopSystem'
export class ServerGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === Action.draw || gameEvent.action === Action.notifyPlayer
            ? this.sendEventToClient(gameEvent)
            : gameEvent.action === Action.create || gameEvent.action === Action.destroy
                ? this.interactWithSystems.retrieveSystemByClass(ServerLifeCycleSystem).onGameEvent(gameEvent)
                : (gameEvent.action === Action.join && this.hasEntitiesByEntityType(gameEvent, EntityType.simpleMatchLobby)) || gameEvent.action === Action.waitingForPlayers
                    ? this.interactWithSystems.retrieveSystemByClass(WaitingAreaSystem).onGameEvent(gameEvent)
                    : gameEvent.action === Action.join || gameEvent.action === Action.quit
                        ? this.interactWithSystems.retrieveSystemByClass(ServerMatchSystem).onGameEvent(gameEvent)
                        : gameEvent.action === Action.register
                            ? this.onRegister(gameEvent)
                            : gameEvent.action === Action.ready || gameEvent.action === Action.nextTurn || gameEvent.action === Action.victory
                                ? this.interactWithSystems.retrieveSystemByClass(PhasingSystem).onGameEvent(gameEvent)
                                : gameEvent.action === Action.newLoop
                                    ? this.interactWithSystems.retrieveSystemByClass(LoopSystem).onGameEvent(gameEvent)
                                    : gameEvent.action === Action.hit
                                        ? this.interactWithSystems.retrieveSystemByClass(HitSystem).onGameEvent(gameEvent)
                                        : gameEvent.action === Action.move || gameEvent.action === Action.updatePlayerPointerState
                                            ? this.interactWithSystems.retrieveSystemByClass(MovingSystem).onGameEvent(gameEvent)
                                            : gameEvent.action === Action.attack
                                                ? this.interactWithSystems.retrieveSystemByClass(AttackingSystem).onGameEvent(gameEvent)
                                                : gameEvent.action === Action.checkCollision || gameEvent.action === Action.collision
                                                    ? this.interactWithSystems.retrieveSystemByClass(CollisionSystem).onGameEvent(gameEvent)
                                                    : gameEvent.action === Action.notifyServer
                                                        ? Promise.resolve()
                                                        : Promise.reject(new Error(errorMessageOnUnknownEventAction(ServerGameEventDispatcherSystem.name, gameEvent)))
    }

    onRegister (gameEvent: GameEvent): Promise<void> {
        const isGameEventHasEntityType = (gameEvent:GameEvent, entityType:EntityType) => this.allEntityTypes(gameEvent).some(gameEventEntityType => gameEventEntityType === entityType)
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
                    ? this.interactWithSystems.retrieveSystemByClass(ServerLifeCycleSystem).onGameEvent(gameEvent)
                    : this.interactWithSystems.retrieveSystemByClass(ServerMatchSystem).onGameEvent(gameEvent)
    }
}
