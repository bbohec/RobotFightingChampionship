import { Hittable } from '../../Components/Hittable'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { victoryEvent } from '../../Events/victory/victory'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { Offensive } from '../../Components/Offensive'

export class HitSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.hittable) && gameEvent.hasEntitiesByEntityType(EntityType.attacker))
            return this.onHit(gameEvent.entityByEntityType(EntityType.hittable), gameEvent.entityByEntityType(EntityType.attacker))
        return this.sendErrorMessageOnUnknownEventAction(gameEvent)
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

    protected getSystemName (): string {
        return HitSystem.name
    }
}
