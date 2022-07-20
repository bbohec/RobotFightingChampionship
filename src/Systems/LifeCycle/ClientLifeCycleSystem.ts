import { makeEntityReference } from '../../Components/EntityReference'
import { makePhysical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Entity } from '../../Entities/Entity'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { activatePointerEvent } from '../../Events/activate/activate'
import { registerPlayerEvent } from '../../Events/register/register'
import { GenericClientLifeCycleSystem } from './GenericClientLifeCycleSystem'

export class ClientLifeCycleSystem extends GenericClientLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.player) && this.hasEntitiesByEntityType(gameEvent, EntityType.pointer)
            ? this.createPointerEntity(gameEvent)
            : this.hasEntitiesByEntityType(gameEvent, EntityType.player)
                ? this.createPlayerEntity(this.interactWithIdentiers.nextIdentifier())
                : Promise.reject(new Error(errorMessageOnUnknownEventAction(ClientLifeCycleSystem.name, gameEvent)))
    }

    private createPointerEntity (gameEvent: GameEvent): Promise<void> {
        const pointerId = this.entityByEntityType(gameEvent, EntityType.pointer)
        this.createEntity(
            new Entity(pointerId),
            [
                makeEntityReference(pointerId, EntityType.pointer),
                makePhysical(pointerId, position(0, 0), ShapeType.pointer, true)
            ]
        )
        this.interactWithEntities.linkEntityToEntities(pointerId, [this.entityByEntityType(gameEvent, EntityType.player)])
        return this.sendEvent(activatePointerEvent(pointerId))
    }

    private createPlayerEntity (playerId: string): Promise<void> {
        this.createEntity(new Entity(playerId), [makeEntityReference(playerId, EntityType.player)])
        return this.sendEvent(registerPlayerEvent(playerId))
    }
}
