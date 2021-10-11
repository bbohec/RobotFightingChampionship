import { EntityReference } from '../../Components/EntityReference'
import { Physical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Entity } from '../../Entities/Entity'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { registerPlayerEvent } from '../../Events/register/register'
import { GenericClientLifeCycleSystem } from './GenericClientLifeCycleSystem'

export class ClientLifeCycleSystem extends GenericClientLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.player) && gameEvent.hasEntitiesByEntityType(EntityType.pointer)) return this.createPointerEntity(gameEvent)
        if (gameEvent.hasEntitiesByEntityType(EntityType.player)) return this.createPlayerEntity(this.interactWithIdentiers.nextIdentifier())
        throw new Error(errorMessageOnUnknownEventAction(ClientLifeCycleSystem.name, gameEvent))
    }

    private createPointerEntity (gameEvent: GameEvent): Promise<void> {
        const pointerId = gameEvent.entityByEntityType(EntityType.pointer)
        this.createEntity(
            new Entity(pointerId),
            [
                new EntityReference(pointerId, EntityType.pointer),
                new Physical(pointerId, position(0, 0), ShapeType.pointer)
            ]
        )
        this.interactWithEntities.linkEntityToEntities(pointerId, [gameEvent.entityByEntityType(EntityType.player)])
        return Promise.resolve()
    }

    private createPlayerEntity (playerId: string): Promise<void> {
        this.createEntity(new Entity(playerId), [new EntityReference(playerId, EntityType.player, new Map())])
        return this.sendEvent(registerPlayerEvent(playerId))
    }
}
