import { EntityReference } from '../../Components/EntityReference'
import { Hittable } from '../../Components/Hittable'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { victoryEvent } from '../../Events/victory/victory'
import { GenericSystem } from '../Generic/GenericSystem'
import { Offensive } from '../../Components/Offensive'

export class HitSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.hittable) &&
            gameEvent.hasEntitiesByEntityType(EntityType.attacker)) return this.onHit(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(HitSystem.name, gameEvent))
    }

    private onHit (gameEvent: GameEvent): Promise<void> {
        const { hittableEntityId, offensiveEntityId } = this.retrieveHittableAndOffensiveEntities(gameEvent)
        const offensiveComponent = this.interactWithEntities.retrieveEntityById(offensiveEntityId).retrieveComponent(Offensive)
        const hittableComponent = this.interactWithEntities.retrieveEntityById(hittableEntityId).retrieveComponent(Hittable)
        this.removeHitPoints(hittableComponent, offensiveComponent)
        return (hittableComponent.hitPoints <= 0) ? this.onNoMoreHitPoints(offensiveEntityId) : Promise.resolve()
    }

    private retrieveHittableAndOffensiveEntities (gameEvent: GameEvent) {
        return { hittableEntityId: gameEvent.entityByEntityType(EntityType.hittable), offensiveEntityId: gameEvent.entityByEntityType(EntityType.attacker) }
    }

    private removeHitPoints (hittable:Hittable, offensive:Offensive) {
        hittable.hitPoints -= offensive.damagePoints
    }

    private onNoMoreHitPoints (hittingEntityId:string):Promise<void> {
        const playerId = this.retrieveEntityRefFromEntityType(hittingEntityId, EntityType.player)
        return this.sendEvent(victoryEvent(this.retrieveEntityRefFromEntityType(playerId, EntityType.match), playerId))
    }

    private retrieveEntityRefFromEntityType (entityId:string, entityType:EntityType) {
        const entityTypeReferences = this.interactWithEntities.retrieveEntityById(entityId).retrieveComponent(EntityReference).entityReferences.get(entityType)
        if (!entityTypeReferences) throw new Error(`Entity with type '${entityType}' missing on entity id '${entityId}' entity references`)
        if (entityTypeReferences.length !== 1) throw new Error(`There is not one id on '${entityType}' references.`)
        return entityTypeReferences[0]
    }
}
