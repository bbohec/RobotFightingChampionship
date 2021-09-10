import { EntityReference } from '../../Components/EntityReference'
import { Phasing, weaponAttackActionPoints } from '../../Components/Phasing'
import { defaultWeaponMaxRange, Physical, Position } from '../../Components/Physical'
import { Playable } from '../../Components/Playable'
import { MatchPlayer, PhaseType } from '../../Components/port/Phase'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { hitEvent } from '../../Events/hit/hit'
import { wrongPhaseNotificationMessage, badPlayerNotificationMessage, notEnoughActionPointNotificationMessage, notifyEvent, outOfRangeNotificationMessage } from '../../Events/notify/notify'
import { GenericSystem } from '../Generic/GenericSystem'
export class AttackingSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const playerEntityReferences = this.interactWithEntities.retrieveEntityById(playerId).retrieveComponent(EntityReference)
        const matchEntity = this.interactWithEntities.retrieveEntityById(playerEntityReferences.retreiveReference(EntityType.match))
        const phasingComponent = matchEntity.retrieveComponent(Phasing)
        const attackerId = gameEvent.entityByEntityType(EntityType.attacker)
        const targetId = gameEvent.entityByEntityType(EntityType.target)
        const genericStepFunction = (check:boolean, notificationMessage:string, nextStep:()=>Promise<void>):Promise<void> => check ? nextStep() : this.sendEvent(notifyEvent(gameEvent.entityByEntityType(EntityType.player), notificationMessage))
        const enoughActionPointCheckStep = (nextStep: ()=>Promise<void>): Promise<void> => genericStepFunction(this.isPhaseEnoughActionPoint(phasingComponent), notEnoughActionPointNotificationMessage, nextStep)
        const targetOnAttackerRangeCheckStep = (nextStep: ()=>Promise<void>): Promise<void> => genericStepFunction(this.isTargetOnAttackerRange(attackerId, targetId), outOfRangeNotificationMessage, nextStep)
        const attackerPhaseCheckStep = (nextStep: ()=>Promise<void>) => genericStepFunction(this.isAttackerPhase(phasingComponent, attackerId, playerEntityReferences.retreiveReference(EntityType.tower), playerEntityReferences.retreiveReference(EntityType.robot)), wrongPhaseNotificationMessage(phasingComponent.currentPhase.phaseType), nextStep)
        const playerPhaseCheckStep = (nextStep: ()=>Promise<void>) => genericStepFunction(this.isPlayerPhase(phasingComponent.currentPhase.matchPlayer, matchEntity.retrieveComponent(Playable), playerId), badPlayerNotificationMessage(playerId), nextStep)

        /*
        const curry = (genericStepFunction:(check:boolean, notificationMessage:string, nextStep:()=>Promise<void>)=>Promise<void>) => {
            return function curried (...args:((nextStep: () => Promise<void>) => Promise<void>)[]):Promise<void> {

            }
        }
        return curry(genericStepFunction)(enoughActionPointCheckStep, targetOnAttackerRangeCheckStep, attackerPhaseCheckStep, playerPhaseCheckStep)
        */

        return playerPhaseCheckStep(
            () => attackerPhaseCheckStep(
                () => targetOnAttackerRangeCheckStep(
                    () => enoughActionPointCheckStep(
                        () => this.attack(attackerId, targetId, phasingComponent)))))
    }

    isPhaseEnoughActionPoint (phasingComponent: Phasing):boolean {
        return phasingComponent.currentPhase.actionPoints >= weaponAttackActionPoints
    }

    private isTargetOnAttackerRange (attackerId:string, targetId:string):boolean {
        const attackerPosition = this.interactWithEntities.retrieveEntityById(attackerId).retrieveComponent(Physical).position
        const targetPosition = this.interactWithEntities.retrieveEntityById(targetId).retrieveComponent(Physical).position
        return this.pythagoreHypotenuse({
            x: Math.abs(targetPosition.x - attackerPosition.x),
            y: Math.abs(targetPosition.y - attackerPosition.y)
        }) <= defaultWeaponMaxRange
    }

    private pythagoreHypotenuse (position:Position):number {
        return Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2))
    }

    private isPlayerPhase (matchPlayer: MatchPlayer|null, playableComponent:Playable, playerId:string):boolean {
        const isMatchPlayerAndPlayerIdValid = (expectedMatchPlayer:MatchPlayer, expectedPlayerIdMatchIndex:number):boolean => matchPlayer === expectedMatchPlayer && playerId === playableComponent.players[expectedPlayerIdMatchIndex]
        return (isMatchPlayerAndPlayerIdValid(MatchPlayer.A, 0) || isMatchPlayerAndPlayerIdValid(MatchPlayer.B, 1))
    }

    private isAttackerPhase (phasingComponent: Phasing, attackerId:string, towerId:string, robotId:string):boolean {
        const phaseAndRelatedEntityMatch = (phaseType:PhaseType, relatedEntityId:string) => phasingComponent.currentPhase.phaseType === phaseType && relatedEntityId === attackerId
        return phaseAndRelatedEntityMatch(PhaseType.Tower, towerId) || phaseAndRelatedEntityMatch(PhaseType.Robot, robotId)
    }

    private attack (attackerId:string, targetId:string, phasingComponent:Phasing):Promise<void> {
        console.log(phasingComponent.currentPhase.actionPoints)
        phasingComponent.currentPhase.actionPoints = phasingComponent.currentPhase.actionPoints - weaponAttackActionPoints
        return this.sendEvent(hitEvent(attackerId, targetId))
    }
}
