import { Hittable } from '../../Components/Hittable'
import { EntityType } from '../../Event/EntityType'
import { retrieveReference } from '../../Components/EntityReference'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { victoryEvent } from '../../Events/victory/victory'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { Offensive } from '../../Components/Offensive'

export class HitSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.hasEntitiesByEntityType(EntityType.hittable) && gameEvent.hasEntitiesByEntityType(EntityType.attacker)
            ? this.onHit(gameEvent.entityByEntityType(EntityType.hittable), gameEvent.entityByEntityType(EntityType.attacker))
            : Promise.reject(new Error(errorMessageOnUnknownEventAction(HitSystem.name, gameEvent)))
    }

    private onHit (hittableEntityId:string, offensiveEntityId:string): Promise<void> {
        const hittableComponent = this.interactWithEntities.retrieveyComponentByEntityId<Hittable>(hittableEntityId)
        this.removeHitPoints(hittableComponent, this.interactWithEntities.retrieveyComponentByEntityId<Offensive>(offensiveEntityId))
        return (hittableComponent.hitPoints <= 0) ? this.onNoMoreHitPoints(offensiveEntityId) : Promise.resolve()
    }

    private removeHitPoints (hittable:Hittable, offensive:Offensive) {
        hittable = { ...hittable, hitPoints: hittable.hitPoints - offensive.damagePoints }
    }

    private onNoMoreHitPoints (hittingEntityId:string):Promise<void> {
        const playerId = retrieveReference(this.entityReferencesByEntityId(hittingEntityId), EntityType.player)
        return this.sendEvent(victoryEvent(retrieveReference(this.entityReferencesByEntityId(playerId), EntityType.match), playerId))
    }
}
