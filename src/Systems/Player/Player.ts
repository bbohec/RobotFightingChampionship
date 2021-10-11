import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { createPlayerPointerEvent } from '../../Events/create/create'
import { GenericServerSystem } from '../Generic/GenericServerSystem'

export class PlayerSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.game) && gameEvent.hasEntitiesByEntityType(EntityType.player)) return this.registerPlayerOnGame(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(PlayerSystem.name, gameEvent))
    }

    registerPlayerOnGame (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.interactWithEntities.linkEntityToEntities(playerId, [gameEvent.entityByEntityType(EntityType.game)])
        return this.sendEvent(createPlayerPointerEvent(playerId))
    }
}
