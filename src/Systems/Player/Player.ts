import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { createMainMenuEvent, createPlayerPointerEvent, createPlayerSimpleMatchLobbyButtonEvent } from '../../Events/create/create'
import { GenericServerSystem } from '../Generic/GenericServerSystem'

export class PlayerSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.game) && gameEvent.hasEntitiesByEntityType(EntityType.player))
            return this.registerPlayerOnGame(gameEvent)
        return this.sendErrorMessageOnUnknownEventAction(gameEvent)
    }

    private registerPlayerOnGame (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.interactWithEntities.linkEntityToEntities(playerId, [gameEvent.entityByEntityType(EntityType.game)])
        const gameId = gameEvent.entityByEntityType(EntityType.game)
        const gameEntityReferences = this.interactWithEntities.retrieveEntityComponentByEntityId(gameId, EntityReference)
        return this.sendEvents([
            createPlayerPointerEvent(playerId),
            createMainMenuEvent(gameId, playerId),
            createPlayerSimpleMatchLobbyButtonEvent(gameEntityReferences.retrieveReference(EntityType.simpleMatchLobby), playerId)
        ])
    }

    protected getSystemName ():string {
        return PlayerSystem.name
    }
}
