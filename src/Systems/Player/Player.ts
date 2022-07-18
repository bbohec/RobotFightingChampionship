import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { createMainMenuEvent, createPlayerPointerEvent, createPlayerSimpleMatchLobbyButtonEvent } from '../../Events/create/create'
import { GenericServerSystem } from '../Generic/GenericServerSystem'

export class PlayerSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.hasEntitiesByEntityType(EntityType.game) && gameEvent.hasEntitiesByEntityType(EntityType.player)
            ? this.registerPlayerOnGame(gameEvent)
            : Promise.reject(new Error(errorMessageOnUnknownEventAction(PlayerSystem.name, gameEvent)))
    }

    private registerPlayerOnGame (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.interactWithEntities.linkEntityToEntities(playerId, [gameEvent.entityByEntityType(EntityType.game)])
        const gameId = gameEvent.entityByEntityType(EntityType.game)
        const gameEntityReferences = this.interactWithEntities.retrieveyComponentByEntityId(gameId, EntityReference)
        return this.sendEvents([
            createPlayerPointerEvent(playerId),
            createMainMenuEvent(gameId, playerId),
            createPlayerSimpleMatchLobbyButtonEvent(gameEntityReferences.retrieveReference(EntityType.simpleMatchLobby), playerId)
        ])
    }
}
