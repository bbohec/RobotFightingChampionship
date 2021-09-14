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
            gameEvent.hasEntitiesByEntityType(EntityType.attacker)) {
            return this.onHit(
                gameEvent.entityByEntityType(EntityType.hittable),
                gameEvent.entityByEntityType(EntityType.attacker)
            )
        }
        throw new Error(errorMessageOnUnknownEventAction(HitSystem.name, gameEvent))
    }

    private onHit (hittableEntityId:string, offensiveEntityId:string): Promise<void> {
        const hittableComponent = this.interactWithEntities.retrieveEntityById(hittableEntityId).retrieveComponent(Hittable)
        this.removeHitPoints(hittableComponent, this.interactWithEntities.retrieveEntityById(offensiveEntityId).retrieveComponent(Offensive))
        return (hittableComponent.hitPoints <= 0) ? this.onNoMoreHitPoints(offensiveEntityId) : Promise.resolve()
    }

    private removeHitPoints (hittable:Hittable, offensive:Offensive) {
        hittable.hitPoints -= offensive.damagePoints
    }

    private onNoMoreHitPoints (hittingEntityId:string):Promise<void> {
        const playerId = this.interactWithEntities.retrieveEntityById(hittingEntityId).retrieveComponent(EntityReference).retreiveReference(EntityType.player)
        return this.sendEvent(victoryEvent(this.interactWithEntities.retrieveEntityById(playerId).retrieveComponent(EntityReference).retreiveReference(EntityType.match), playerId))
    }
}
