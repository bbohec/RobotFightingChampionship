import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericGameEventDispatcherSystem } from './GenericGameEventDispatcherSystem'
import { ServerLifeCycleSystem } from '../LifeCycle/ServerLifeCycleSystem'
import { WaitingAreaSystem } from '../WaitingArea/WaitingAreaSystem'
import { ServerMatchSystem } from '../Match/ServerMatchSystem'
import { Action } from '../../Event/Action'
import { PhasingSystem } from '../Phasing/PhasingSystem'
import { EntityType } from '../../Event/EntityType'
import { HitSystem } from '../Hit/HitSystem'
import { AttackingSystem } from '../Attacking/AttackingSystem'
import { MovingSystem } from '../Moving/MovingSystem'
import { CollisionSystem } from '../Collision/CollisionSystem'
import { PlayerSystem } from '../Player/Player'
export class ServerGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.hide || gameEvent.action === Action.show || gameEvent.action === Action.notify) return this.sendEventToClient(gameEvent)
        if (gameEvent.action === Action.create ||
            gameEvent.action === Action.destroy) return this.interactWithSystems.retrieveSystemByClass(ServerLifeCycleSystem).onGameEvent(gameEvent)
        if ((
            gameEvent.action === Action.join &&
            gameEvent.hasEntitiesByEntityType(EntityType.simpleMatchLobby)
        ) ||
        gameEvent.action === Action.waitingForPlayers
        ) return this.interactWithSystems.retrieveSystemByClass(WaitingAreaSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.join || gameEvent.action === Action.quit) return this.interactWithSystems.retrieveSystemByClass(ServerMatchSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.register) return this.onRegister(gameEvent)
        if (gameEvent.action === Action.ready ||
            gameEvent.action === Action.nextTurn ||
            gameEvent.action === Action.victory
        ) return this.interactWithSystems.retrieveSystemByClass(PhasingSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.hit) return this.interactWithSystems.retrieveSystemByClass(HitSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.move || gameEvent.action === Action.updatePlayerPointerState) return this.interactWithSystems.retrieveSystemByClass(MovingSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.attack) return this.interactWithSystems.retrieveSystemByClass(AttackingSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.checkCollision || gameEvent.action === Action.collision) return this.interactWithSystems.retrieveSystemByClass(CollisionSystem).onGameEvent(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ServerGameEventDispatcherSystem.name, gameEvent))
    }

    onRegister (gameEvent: GameEvent): Promise<void> {
        const isGameEventHasEntityType = (gameEvent:GameEvent, entityType:EntityType) => gameEvent.allEntityTypes().some(gameEventEntityType => gameEventEntityType === entityType)
        const includesGrid = isGameEventHasEntityType(gameEvent, EntityType.grid)
        const includesRobot = isGameEventHasEntityType(gameEvent, EntityType.robot)
        const includesTower = isGameEventHasEntityType(gameEvent, EntityType.tower)
        const includesPlayer = isGameEventHasEntityType(gameEvent, EntityType.player)
        const includesGame = isGameEventHasEntityType(gameEvent, EntityType.game)
        const includesPointer = isGameEventHasEntityType(gameEvent, EntityType.pointer)
        if (includesPlayer && includesPointer) return this.sendEventToClient(gameEvent)
        if (includesPlayer && includesGame) return this.interactWithSystems.retrieveSystemByClass(PlayerSystem).onGameEvent(gameEvent)
        if (includesPlayer && !includesGrid && !includesRobot && !includesTower) return this.interactWithSystems.retrieveSystemByClass(ServerLifeCycleSystem).onGameEvent(gameEvent)
        return this.interactWithSystems.retrieveSystemByClass(ServerMatchSystem).onGameEvent(gameEvent)
    }
}
