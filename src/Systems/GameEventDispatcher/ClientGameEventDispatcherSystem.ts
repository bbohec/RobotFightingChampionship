import { GameEvent } from '../../Events/port/GameEvent'
import { ClientLifeCycleSystem } from '../LifeCycle/ClientLifeCycleSystem'
import { PlayerWantJoinSimpleMatch, errorMessageOnUnknownEventAction } from '../../Events/port/GameEvents'
import { DrawingSystem } from '../Drawing/DrawingSystem'
import { GenericGameEventDispatcherSystem } from './GenericGameEventDispatcherSystem'
import { ClientMatchMakingSystem } from '../Match/ClientMatchSystem'

export class ClientGameEventDispatcherSystem extends GenericGameEventDispatcherSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.message === 'Create') { return this.interactWithSystems.retrieveSystemByClass(ClientLifeCycleSystem).onGameEvent(gameEvent) }
        if (gameEvent.message === PlayerWantJoinSimpleMatch('Player A', 'Simple Match Lobby').message) { return this.interactWithSystems.retrieveSystemByClass(ClientMatchMakingSystem).onGameEvent(gameEvent) }
        if (gameEvent.message === 'Show' || gameEvent.message === 'Hide') { return this.interactWithSystems.retrieveSystemByClass(DrawingSystem).onGameEvent(gameEvent) }
        throw new Error(errorMessageOnUnknownEventAction(ClientGameEventDispatcherSystem.name, gameEvent))
    }
}
