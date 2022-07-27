import { Hittable } from '../components/Hittable'
import { EntityType } from '../../type/EntityType'
import { retrieveReference } from '../components/EntityReference'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { victoryEvent } from '../../events/victory/victory'
import { GenericServerSystem } from '../system'
import { Offensive } from '../components/Offensive'

export class HitSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.hittable) && this.hasEntitiesByEntityType(gameEvent, EntityType.attacker)
            ? this.onHit(this.entityByEntityType(gameEvent, EntityType.hittable), this.entityByEntityType(gameEvent, EntityType.attacker))
            : Promise.reject(new Error(errorMessageOnUnknownEventAction(HitSystem.name, gameEvent)))
    }

    private onHit (hittableEntityId:string, offensiveEntityId:string): Promise<void> {
        const hittable = this.removeHitPoints(this.componentRepository.retrieveHittable(hittableEntityId), this.componentRepository.retrieveOffensive(offensiveEntityId))
        return (hittable.hitPoints <= 0) ? this.onNoMoreHitPoints(offensiveEntityId) : Promise.resolve()
    }

    private removeHitPoints (hittable:Hittable, offensive:Offensive):Hittable {
        const updatedHittable:Hittable = { ...hittable, hitPoints: hittable.hitPoints - offensive.damagePoints }
        this.componentRepository.saveComponent(updatedHittable)
        return updatedHittable
    }

    private onNoMoreHitPoints (hittingEntityId:string):Promise<void> {
        const playerId = retrieveReference(this.entityReferencesByEntityId(hittingEntityId), EntityType.player)
        return this.sendEvent(victoryEvent(retrieveReference(this.entityReferencesByEntityId(playerId), EntityType.match), playerId))
    }
}