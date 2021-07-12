import { EntityType } from '../../Event/EntityType'
import { GameEvent, MissingOriginEntityId, MissingTargetEntityId } from '../../Event/GameEvent'
import { joinSimpleMatchServerEvent } from '../../Events/join/join'
import { showEvent } from '../../Events/show/show'
import { hideEvent } from '../../Events/hide/hide'
import { GenericSystem } from '../Generic/GenericSystem'
export class ClientMatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        if (gameEvent.targetEntityId === undefined) throw new Error(MissingTargetEntityId)
        const events = [
            joinSimpleMatchServerEvent(gameEvent.originEntityId),
            hideEvent(EntityType.mainMenu, gameEvent.targetEntityId),
            showEvent(EntityType.matchMaking)
        ]
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }
}
