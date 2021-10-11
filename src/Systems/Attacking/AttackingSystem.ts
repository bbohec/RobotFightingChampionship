import { Phasing, weaponAttackActionPoints } from '../../Components/Phasing'
import { defaultWeaponMaxRange, Physical, Position } from '../../Components/Physical'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { hitEvent } from '../../Events/hit/hit'
import { wrongUnitPhaseNotificationMessage, wrongPlayerPhaseNotificationMessage, notEnoughActionPointNotificationMessage, notifyEvent, outOfRangeNotificationMessage } from '../../Events/notify/notify'
import { ArtithmeticSystem } from '../Generic/ArithmeticSystem'
export class AttackingSystem extends ArtithmeticSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const playerEntityReference = this.entityReferencesByEntityId(playerId)
        const phasingComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(playerEntityReference.retreiveReference(EntityType.match), Phasing)
        const attackerId = gameEvent.entityByEntityType(EntityType.attacker)
        const targetId = gameEvent.entityByEntityType(EntityType.target)
        const genericStepFunction = (check:boolean, notificationMessage:string, nextStep:()=>Promise<void>):Promise<void> => check ? nextStep() : this.sendEvent(notifyEvent(gameEvent.entityByEntityType(EntityType.player), notificationMessage))
        const enoughActionPointCheckStep = (nextStep: ()=>Promise<void>): Promise<void> => genericStepFunction(this.isPhaseEnoughActionPoint(phasingComponent), notEnoughActionPointNotificationMessage, nextStep)
        const targetOnAttackerRangeCheckStep = (nextStep: ()=>Promise<void>): Promise<void> => genericStepFunction(this.isTargetOnAttackerRange(this.interactWithEntities.retrieveEntityComponentByEntityId(attackerId, Physical).position, this.interactWithEntities.retrieveEntityComponentByEntityId(targetId, Physical).position), outOfRangeNotificationMessage, nextStep)
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
