import { GameEvent } from '../../Events/port/GameEvent'
import { GenericGameEventDispatcherSystem } from './GenericGameEventDispatcherSystem'
import { ServerLifeCycleSystem } from '../LifeCycle/ServerLifeCycleSystem'
import { WaitingAreaSystem } from '../WaitingArea/WaitingAreaSystem'
import { errorMessageOnUnknownEventAction } from '../../Events/port/GameEvents'
import { ServerMatchSystem } from '../Match/ServerMatchSystem'
import { Action } from '../../Events/port/Action'
import { PhasingSystem } from '../Phasing/PhasingSystem'
export class ServerGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.create) { return this.interactWithSystems.retrieveSystemByClass(ServerLifeCycleSystem).onGameEvent(gameEvent) }
        if (gameEvent.action === Action.wantToJoin || gameEvent.action === Action.waitingForPlayers) return this.interactWithSystems.retrieveSystemByClass(WaitingAreaSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.playerJoinMatch) return this.interactWithSystems.retrieveSystemByClass(ServerMatchSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.register) return this.interactWithSystems.retrieveSystemByClass(ServerMatchSystem).onGameEvent(gameEvent)
        if (gameEvent.action === Action.ready) return this.interactWithSystems.retrieveSystemByClass(PhasingSystem).onGameEvent(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ServerGameEventDispatcherSystem.name, gameEvent))
    }
}
