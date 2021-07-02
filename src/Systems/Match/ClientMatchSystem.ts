import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { GameEvent } from '../../Events/port/GameEvent'
import { MissingOriginEntityId, newEvent } from '../../Events/port/GameEvents'
import { GenericSystem } from '../Generic/GenericSystem'
export class ClientMatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        const events = [
            newEvent(Action.wantToJoin, EntityType.nothing, EntityType.serverGame, undefined, gameEvent.originEntityId),
            newEvent(Action.hide, EntityType.nothing, EntityType.mainMenu),
            newEvent(Action.show, EntityType.nothing, EntityType.matchMaking)
        ]
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }
}
