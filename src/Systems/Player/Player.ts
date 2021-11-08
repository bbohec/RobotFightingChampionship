import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { createMainMenuEvent, createPlayerPointerEvent, createPlayerSimpleMatchLobbyButtonEvent } from '../../Events/create/create'
import { GenericServerSystem } from '../Generic/GenericServerSystem'

export class PlayerSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.game) && gameEvent.hasEntitiesByEntityType(EntityType.player)) return this.registerPlayerOnGame(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(PlayerSystem.name, gameEvent))
    }

    private registerPlayerOnGame (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.interactWithEntities.linkEntityToEntities(playerId, [gameEvent.entityByEntityType(EntityType.game)])
        const gameId = gameEvent.entityByEntityType(EntityType.game)
        const gameEntityReferences = this.interactWithEntities.retrieveEntityComponentByEntityId(gameId, EntityReference)
        return this.sendEvents([
            createPlayerPointerEvent(playerId),
            createMainMenuEvent(gameId, playerId),
            createPlayerSimpleMatchLobbyButtonEvent(gameEntityReferences.retreiveReference(EntityType.simpleMatchLobby), playerId)
        ])
    }

    private sendEvents (gameEvents:GameEvent[]):Promise<void> {
        return Promise.all(gameEvents.map(gameEvent => this.sendEvent(gameEvent)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }
}
