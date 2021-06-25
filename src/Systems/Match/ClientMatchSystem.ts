import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { GameEvent } from '../../Events/port/GameEvent'
import { MissingOriginEntityId, newEvent } from '../../Events/port/GameEvents'
import { ClientGameEventDispatcherSystem } from '../GameEventDispatcher/ClientGameEventDispatcherSystem'
import { GenericSystem } from '../Generic/GenericSystem'
export class ClientMatchMakingSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        const events = [
            newEvent(Action.wantToJoin, EntityType.serverGame, undefined, gameEvent.originEntityId),
            newEvent(Action.hide, EntityType.mainMenu),
            newEvent(Action.show, EntityType.matchMaking)
        ]
        return Promise.all(events.map(event => this.interactWithSystems.retrieveSystemByClass(ClientGameEventDispatcherSystem).sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }
}
