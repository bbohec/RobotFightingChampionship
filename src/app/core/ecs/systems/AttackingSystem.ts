import { retrieveReference } from '../components/EntityReference'
import { Phasing, weaponAttackActionPoints } from '../components/Phasing'
import { defaultWeaponMaxRange, Position } from '../components/Physical'
import { EntityType } from '../../type/EntityType'
import { GameEvent } from '../../type/GameEvent'
import { hitEvent } from '../../events/hit/hit'
import { notEnoughActionPointNotificationMessage, notifyPlayerEvent, outOfRangeNotificationMessage, wrongPlayerPhaseNotificationMessage, wrongUnitPhaseNotificationMessage } from '../../events/notifyPlayer/notifyPlayer'
import { ArtithmeticSystem } from '../system'

export class AttackingSystem extends ArtithmeticSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        const playerEntityReference = this.entityReferencesByEntityId(playerId)
        if (!playerEntityReference) throw new Error('Player entity reference not found for entity ' + playerId)
        const phasingComponent = this.interactWithEntities.retreivePhasing(retrieveReference(playerEntityReference, EntityType.match))
        if (!phasingComponent) throw new Error('Phasing component not found for entity ' + playerEntityReference.entityId)
        const attackerId = this.entityByEntityType(gameEvent, EntityType.attacker)
        const targetId = this.entityByEntityType(gameEvent, EntityType.target)
        const attackerPhysical = this.interactWithEntities.retrievePhysical(attackerId)
        const targetPhysical = this.interactWithEntities.retrievePhysical(targetId)
        if (!attackerPhysical) throw new Error('Physical component not found for entity ' + attackerId)
        if (!targetPhysical) throw new Error('Physical component not found for entity ' + targetId)
        const genericStepFunction = (check:boolean, notificationMessage:string, nextStep:()=>Promise<void>):Promise<void> => check ? nextStep() : this.sendEvent(notifyPlayerEvent(this.entityByEntityType(gameEvent, EntityType.player), notificationMessage))
        const enoughActionPointCheckStep = (nextStep: ()=>Promise<void>): Promise<void> => genericStepFunction(this.isPhaseEnoughActionPoint(phasingComponent), notEnoughActionPointNotificationMessage, nextStep)
        const targetOnAttackerRangeCheckStep = (nextStep: ()=>Promise<void>): Promise<void> => genericStepFunction(this.isTargetOnAttackerRange(attackerPhysical.position, targetPhysical.position), outOfRangeNotificationMessage, nextStep)
        const attackingUnitPhaseCheckStep = (nextStep: ()=>Promise<void>) => genericStepFunction(this.isAttackingUnitPhase(phasingComponent, attackerId), wrongUnitPhaseNotificationMessage(phasingComponent.currentPhase), nextStep)
        const playerPhaseCheckStep = (nextStep: ()=>Promise<void>) => genericStepFunction(this.isPlayerPhase(phasingComponent, playerId), wrongPlayerPhaseNotificationMessage(playerId), nextStep)

        /*
        const curry = (genericStepFunction:(check:boolean, notificationMessage:string, nextStep:()=>Promise<void>)=>Promise<void>) => {
            return function curried (...args:((nextStep: () => Promise<void>) => Promise<void>)[]):Promise<void> {

            }
        }
        return curry(genericStepFunction)(enoughActionPointCheckStep, targetOnAttackerRangeCheckStep, attackerPhaseCheckStep, playerPhaseCheckStep)
        */

        return playerPhaseCheckStep(
            () => attackingUnitPhaseCheckStep(
                () => targetOnAttackerRangeCheckStep(
                    () => enoughActionPointCheckStep(
                        () => this.attack(attackerId, targetId, phasingComponent)))))
    }

    private isPhaseEnoughActionPoint (phasingComponent: Phasing):boolean {
        return phasingComponent.currentPhase.actionPoints >= weaponAttackActionPoints
    }

    private isTargetOnAttackerRange (attackerPosition:Position, targetPosition:Position):boolean {
        return this.pythagoreHypotenuse({ x: Math.abs(targetPosition.x - attackerPosition.x), y: Math.abs(targetPosition.y - attackerPosition.y) }) <= defaultWeaponMaxRange
    }

    private isPlayerPhase (phasingComponent:Phasing, eventPlayerId:string):boolean {
        return phasingComponent.currentPhase.currentPlayerId === eventPlayerId
    }

    private isAttackingUnitPhase (phasingComponent: Phasing, eventAttackerId:string):boolean {
        return phasingComponent.currentPhase.currentUnitId === eventAttackerId
    }

    private attack (attackerId:string, targetId:string, phasingComponent:Phasing):Promise<void> {
        phasingComponent.currentPhase.actionPoints = phasingComponent.currentPhase.actionPoints - weaponAttackActionPoints
        return this.sendEvent(hitEvent(attackerId, targetId))
    }
}
