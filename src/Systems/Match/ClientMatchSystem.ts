import { GameEvent } from '../../Events/port/GameEvent'
import { PlayerWantJoinSimpleMatch, MainMenuHide, MatchMakingShowEvent } from '../../Events/port/GameEvents'
import { ClientGameEventDispatcherSystem } from '../GameEventDispatcher/ClientGameEventDispatcherSystem'
import { GenericSystem } from '../Generic/GenericSystem'
export class ClientMatchMakingSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const events = [
            PlayerWantJoinSimpleMatch(gameEvent.sourceRef, 'Server Game'),
            MainMenuHide,
            MatchMakingShowEvent
        ]
        return Promise.all(events.map(event => this.interactWithSystems.retrieveSystemByClass(ClientGameEventDispatcherSystem).sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }
}
