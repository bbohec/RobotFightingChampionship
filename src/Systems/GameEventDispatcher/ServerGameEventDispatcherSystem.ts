import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericGameEventDispatcherSystem } from './GenericGameEventDispatcherSystem'
import { ServerLifeCycleSystem } from '../LifeCycle/ServerLifeCycleSystem'
import { WaitingAreaSystem } from '../WaitingArea/WaitingAreaSystem'
import { ServerMatchSystem } from '../Match/ServerMatchSystem'
import { Action } from '../../Event/Action'
import { PhasingSystem } from '../Phasing/PhasingSystem'
import { EntityType } from '../../Event/EntityType'
import { HitSystem } from '../Hit/HitSystem'
export class ServerGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.create) { return this.interactWithSystems.retrieveSystemByClass(ServerLifeCycleSystem).onGameEvent(gameEvent) }
        if ((gameEvent.action === Action.join && gameEvent.targetEntityType === EntityType.simpleMatchLobby) || gameEvent.action === Action.waitingForPlayers) return this.interactWithSystems.retrieveSystemByClass(WaitingAreaSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.join) return this.interactWithSystems.retrieveSystemByClass(ServerMatchSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.register) return this.interactWithSystems.retrieveSystemByClass(ServerMatchSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.ready || gameEvent.action === Action.nextTurn) return this.interactWithSystems.retrieveSystemByClass(PhasingSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.hit) return this.interactWithSystems.retrieveSystemByClass(HitSystem).onGameEvent(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ServerGameEventDispatcherSystem.name, gameEvent))
    }
}
