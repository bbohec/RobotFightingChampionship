import { linkEntityToEntities, retrieveReference } from '../components/EntityReference'
import { EntityType } from '../../type/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { createMainMenuEvent, createPlayerPointerEvent, createPlayerSimpleMatchLobbyButtonEvent } from '../../events/create/create'
import { GenericServerSystem } from '../system'

export class PlayerSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.game) && this.hasEntitiesByEntityType(gameEvent, EntityType.player)
            ? this.registerPlayerOnGame(gameEvent)
            : Promise.reject(new Error(errorMessageOnUnknownEventAction(PlayerSystem.name, gameEvent)))
    }

    private registerPlayerOnGame (gameEvent: GameEvent): Promise<void> {
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        linkEntityToEntities(this.componentRepository, playerId, [this.entityByEntityType(gameEvent, EntityType.game)])
        const gameId = this.entityByEntityType(gameEvent, EntityType.game)
        const gameEntityReferences = this.componentRepository.retrieveComponent(gameId, 'EntityReference')
        return this.sendEvents([
            createPlayerPointerEvent(playerId),
            createMainMenuEvent(gameId, playerId),
            createPlayerSimpleMatchLobbyButtonEvent(retrieveReference(gameEntityReferences, EntityType.simpleMatchLobby), playerId)
        ])
    }
}
