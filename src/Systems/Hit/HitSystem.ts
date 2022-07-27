import { Hittable } from '../../core/components/Hittable'
import { EntityType } from '../../core/type/EntityType'
import { retrieveReference } from '../../core/components/EntityReference'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../core/type/GameEvent'
import { victoryEvent } from '../../Events/victory/victory'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { Offensive } from '../../core/components/Offensive'

export class HitSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.hittable) && this.hasEntitiesByEntityType(gameEvent, EntityType.attacker)
            ? this.onHit(this.entityByEntityType(gameEvent, EntityType.hittable), this.entityByEntityType(gameEvent, EntityType.attacker))
            : Promise.reject(new Error(errorMessageOnUnknownEventAction(HitSystem.name, gameEvent)))
    }

    private onHit (hittableEntityId:string, offensiveEntityId:string): Promise<void> {
        const hittable = this.removeHitPoints(this.interactWithEntities.retrieveHittable(hittableEntityId), this.interactWithEntities.retrieveOffensive(offensiveEntityId))
        return (hittable.hitPoints <= 0) ? this.onNoMoreHitPoints(offensiveEntityId) : Promise.resolve()
    }

    private removeHitPoints (hittable:Hittable, offensive:Offensive):Hittable {
        const updatedHittable:Hittable = { ...hittable, hitPoints: hittable.hitPoints - offensive.damagePoints }
        this.interactWithEntities.saveComponent(updatedHittable)
        return updatedHittable
    }

    private onNoMoreHitPoints (hittingEntityId:string):Promise<void> {
        const playerId = retrieveReference(this.entityReferencesByEntityId(hittingEntityId), EntityType.player)
        return this.sendEvent(victoryEvent(retrieveReference(this.entityReferencesByEntityId(playerId), EntityType.match), playerId))
    }
}
