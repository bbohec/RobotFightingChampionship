import { GameEvent } from '../../Events/port/GameEvent'
import { GenericGameEventDispatcherSystem } from './GenericGameEventDispatcherSystem'
import { ServerLifeCycleSystem } from '../LifeCycle/ServerLifeCycleSystem'
import { WaitingAreaSystem } from '../WaitingArea/WaitingAreaSystem'
import { errorMessageOnUnknownEventAction } from '../../Events/port/GameEvents'
import { MatchSystem } from '../Match/MatchSystem'
export class ServerGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.message === 'Create') { return this.interactWithSystems.retrieveSystemByClass(ServerLifeCycleSystem).onGameEvent(gameEvent) }
        if (gameEvent.message === 'Want to join.' || gameEvent.message === 'Waiting for players') { return this.interactWithSystems.retrieveSystemByClass(WaitingAreaSystem).onGameEvent(gameEvent) }
        if (gameEvent.message === 'Player join match') return this.interactWithSystems.retrieveSystemByClass(MatchSystem).onGameEvent(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ServerGameEventDispatcherSystem.name, gameEvent))
    }
}
