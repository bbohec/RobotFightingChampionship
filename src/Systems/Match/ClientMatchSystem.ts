import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { joinSimpleMatchServerEvent } from '../../Events/join/join'
import { showEvent } from '../../Events/show/show'
import { hideEvent } from '../../Events/hide/hide'
import { GenericSystem } from '../Generic/GenericSystem'
import { Player } from '../../Entities/Player'
export class ClientMatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const events = [
            joinSimpleMatchServerEvent(gameEvent.entityByEntityType(EntityType.player), gameEvent.entityByEntityType(EntityType.simpleMatchLobby)),
            hideEvent(EntityType.mainMenu, gameEvent.entityByEntityType(EntityType.mainMenu)),
            showEvent(EntityType.matchMaking, gameEvent.entityByEntityType(EntityType.simpleMatchLobby), this.interactWithEntities.retrieveEntityByClass(Player).id)
        ]
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }
}
