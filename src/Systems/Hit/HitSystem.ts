import { EntityReference } from '../../Components/EntityReference'
import { GenericComponent } from '../../Components/GenericComponent'
import { Hittable } from '../../Components/Hittable'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent, MissingOriginEntityId, MissingTargetEntityId } from '../../Event/GameEvent'
import { victoryEvent } from '../../Events/victory/victory'
import { GenericSystem } from '../Generic/GenericSystem'

export class Offensive extends GenericComponent {
    constructor (entityId: string, damagePoints:number) {
        super(entityId)
        this.damagePoints = damagePoints
    }

    damagePoints:number
}

export class HitSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.targetEntityType !== EntityType.nobody) return this.onHit(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(HitSystem.name, gameEvent))
    }

    private onHit (gameEvent: GameEvent): Promise<void> {
        const { hittableEntityId, offensiveEntityId } = this.retrieveHittableAndOffensiveEntities(gameEvent)
        const hittableComponent = this.interactWithEntities.retrieveEntityById(hittableEntityId).retrieveComponent(Hittable)
        const offensiveComponent = this.interactWithEntities.retrieveEntityById(offensiveEntityId).retrieveComponent(Offensive)
        this.removeHitPoints(hittableComponent, offensiveComponent)
        return (hittableComponent.hitPoints <= 0) ? this.onNoMoreHitPoints(offensiveEntityId) : Promise.resolve()
    }

    private retrieveHittableAndOffensiveEntities (gameEvent: GameEvent) {
        if (!gameEvent.targetEntityId) throw new Error(MissingTargetEntityId)
        if (!gameEvent.originEntityId) throw new Error(MissingOriginEntityId)
        return { hittableEntityId: gameEvent.targetEntityId, offensiveEntityId: gameEvent.originEntityId }
    }

    private removeHitPoints (hittable:Hittable, offensive:Offensive) {
        hittable.hitPoints -= offensive.damagePoints
    }

    private onNoMoreHitPoints (hittingEntityId:string):Promise<void> {
        const playerId = this.retrieveEntityRefFromEntityType(hittingEntityId, EntityType.player)
        return this.sendEvent(victoryEvent(this.retrieveEntityRefFromEntityType(playerId, EntityType.match), playerId))
    }

    private retrieveEntityRefFromEntityType (entityId:string, entityType:EntityType) {
        for (const [entityIdReference, entityTypeReference] of this.interactWithEntities.retrieveEntityById(entityId).retrieveComponent(EntityReference).entityReferences.entries()) {
            if (entityTypeReference === entityType) return entityIdReference
        }
        throw new Error(`Entity with type '${entityType}' missing on entity id '${entityId}' entity references`)
    }
}
