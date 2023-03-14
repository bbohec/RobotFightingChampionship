import { Hittable } from '../components/Hittable'
import { EntityType } from '../../type/EntityType'
import { retrieveReference, retrieveReferences } from '../components/EntityReference'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { victoryEvent } from '../../events/victory/victory'
import { GenericServerSystem } from '../system'
import { Offensive } from '../components/Offensive'
import { notifyPlayerEvent } from '../../events/notifyPlayer/notifyPlayer'
import { entityHasBeenDamaged, entityHasBeenDetroyed } from '../../../messages'
import { EntityId } from '../entity'

export class HitSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.hittable) && this.hasEntitiesByEntityType(gameEvent, EntityType.attacker)
            ? this.onHit(this.entityByEntityType(gameEvent, EntityType.hittable), this.entityByEntityType(gameEvent, EntityType.attacker))
            : Promise.reject(new Error(errorMessageOnUnknownEventAction(HitSystem.name, gameEvent)))
    }

    private onHit (hittableEntityId:string, offensiveEntityId:string): Promise<void> {
        const offensive = this.componentRepository.retrieveComponent(offensiveEntityId, 'Offensive')
        const offensivePlayer = retrieveReference(this.entityReferencesByEntityId(offensiveEntityId), EntityType.player)
        const hittable = this.removeHitPoints(this.componentRepository.retrieveComponent(hittableEntityId, 'Hittable'), offensive)
        const matchId = retrieveReference(this.entityReferencesByEntityId(offensivePlayer), EntityType.match)
        const players = retrieveReferences(this.componentRepository.retrieveComponent(matchId, 'EntityReference'), EntityType.player)
        return this.sendEvents([
            ...players.map(player => notifyPlayerEvent(player, entityHasBeenDamaged(offensiveEntityId, hittableEntityId, offensive.damagePoints, hittable.hitPoints))),
            ...(hittable.hitPoints <= 0 ? this.onNoMoreHitPoints(hittableEntityId, offensiveEntityId, matchId, offensivePlayer, players) : [])
        ])
    }

    private removeHitPoints (hittable:Hittable, offensive:Offensive):Hittable {
        const updatedHittable:Hittable = { ...hittable, hitPoints: hittable.hitPoints - offensive.damagePoints }
        this.componentRepository.saveComponent(updatedHittable)
        return updatedHittable
    }

    private onNoMoreHitPoints (hittableEntityId:string, offensiveEntityId:string, match:EntityId, offensivePlayer:EntityId, players:EntityId[]):GameEvent[] {
        return [
            victoryEvent(match, offensivePlayer),
            ...players.map(player => notifyPlayerEvent(player, entityHasBeenDetroyed(offensiveEntityId, hittableEntityId)))
        ]
    }
}
