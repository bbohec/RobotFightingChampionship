import { EntityReference } from '../../Components/EntityReference'
import { Physical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Entity } from '../../Entities/Entity'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { activatePointerEvent } from '../../Events/activate/activate'
import { registerPlayerEvent } from '../../Events/register/register'
import { GenericClientLifeCycleSystem } from './GenericClientLifeCycleSystem'

export class ClientLifeCycleSystem extends GenericClientLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.hasEntitiesByEntityType(EntityType.player) && gameEvent.hasEntitiesByEntityType(EntityType.pointer) ? this.createPointerEntity(gameEvent)
        : gameEvent.hasEntitiesByEntityType(EntityType.player) ? this.createPlayerEntity(this.interactWithIdentiers.nextIdentifier())
        : Promise.reject(new Error(errorMessageOnUnknownEventAction(ClientLifeCycleSystem.name, gameEvent))) 
    }

    private createPointerEntity (gameEvent: GameEvent): Promise<void> {
        const pointerId = gameEvent.entityByEntityType(EntityType.pointer)
        this.createEntity(
            new Entity(pointerId),
            [
                new EntityReference(pointerId, EntityType.pointer),
                new Physical(pointerId, position(0, 0), ShapeType.pointer, true)
            ]
        )
        this.interactWithEntities.linkEntityToEntities(pointerId, [gameEvent.entityByEntityType(EntityType.player)])
        return this.sendEvent(activatePointerEvent(pointerId))
    }

    private createPlayerEntity (playerId: string): Promise<void> {
        this.createEntity(new Entity(playerId), [new EntityReference(playerId, EntityType.player, new Map())])
        return this.sendEvent(registerPlayerEvent(playerId))
    }
}
