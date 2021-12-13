import { Hittable } from '../../Components/Hittable'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { victoryEvent } from '../../Events/victory/victory'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { Offensive } from '../../Components/Offensive'

export class HitSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.hasEntitiesByEntityType(EntityType.hittable) && gameEvent.hasEntitiesByEntityType(EntityType.attacker) 
        ? this.onHit(gameEvent.entityByEntityType(EntityType.hittable),gameEvent.entityByEntityType(EntityType.attacker))
        : Promise.reject(new Error(errorMessageOnUnknownEventAction(HitSystem.name, gameEvent)))
    }

    private onHit (hittableEntityId:string, offensiveEntityId:string): Promise<void> {
        const hittableComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(hittableEntityId, Hittable)
        this.removeHitPoints(hittableComponent, this.interactWithEntities.retrieveEntityComponentByEntityId(offensiveEntityId, Offensive))
        return (hittableComponent.hitPoints <= 0) ? this.onNoMoreHitPoints(offensiveEntityId) : Promise.resolve()
    }

    private removeHitPoints (hittable:Hittable, offensive:Offensive) {
        hittable.hitPoints -= offensive.damagePoints
    }

    private onNoMoreHitPoints (hittingEntityId:string):Promise<void> {
        const playerId = this.entityReferencesByEntityId(hittingEntityId).retrieveReference(EntityType.player)
        return this.sendEvent(victoryEvent(this.entityReferencesByEntityId(playerId).retrieveReference(EntityType.match), playerId))
    }
}
