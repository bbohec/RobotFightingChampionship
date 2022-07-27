import { componentIsNot, missingCurrentUnitIdOnPhase } from '../../../messages'
import { Component, GenericComponent } from '../component'
import { Phase } from '../../type/Phase'
import { PhaseType } from '../../type/PhaseType'
import { EntityId } from '../entity'
import { EntityIds } from '../../../test/entityIds'
const noActionPoint = 0
export const maxPlayerPerMatch = 2
export const defaultActionPoints = 12
export const weaponAttackActionPoints = 4
export const placementActionPoints = 1000
export const preparingGamePhase:Phase = ({ phaseType: PhaseType.Prepare, currentPlayerId: null, currentUnitId: null, actionPoints: noActionPoint, auto: true })
export const placementPhase = (currentPlayerId:string, currentUnitId:string, auto:boolean, actionPoints:number):Phase => ({ phaseType: PhaseType.Placement, currentPlayerId, currentUnitId, actionPoints, auto })
export const playerATowerManualPlacementPhase = (actionPoints:number = placementActionPoints):Phase => placementPhase(EntityIds.playerA, EntityIds.playerATower, false, actionPoints)
export const playerATowerAutoPlacementPhase = (actionPoints:number = placementActionPoints):Phase => placementPhase(EntityIds.playerA, EntityIds.playerATower, true, actionPoints)
export const playerARobotManualPlacementPhase = (actionPoints:number = placementActionPoints) :Phase => placementPhase(EntityIds.playerA, EntityIds.playerARobot, false, actionPoints)
export const playerARobotAutoPlacementPhase = (actionPoints:number = placementActionPoints) :Phase => placementPhase(EntityIds.playerA, EntityIds.playerARobot, true, actionPoints)
export const playerBTowerManualPlacementPhase = (actionPoints:number = placementActionPoints) :Phase => placementPhase(EntityIds.playerB, EntityIds.playerBTower, false, actionPoints)
export const playerBTowerAutoPlacementPhase = (actionPoints:number = placementActionPoints) :Phase => placementPhase(EntityIds.playerB, EntityIds.playerBTower, true, actionPoints)
export const playerBRobotManualPlacementPhase = (actionPoints:number = placementActionPoints) :Phase => placementPhase(EntityIds.playerB, EntityIds.playerBRobot, false, actionPoints)
export const playerBRobotAutoPlacementPhase = (actionPoints:number = placementActionPoints) :Phase => placementPhase(EntityIds.playerB, EntityIds.playerBRobot, true, actionPoints)
export const fightPhase = (currentPlayerId:string, currentUnitId:string, actionPoints = defaultActionPoints):Phase => ({ phaseType: PhaseType.Fight, currentPlayerId, currentUnitId, actionPoints, auto: false })
export const playerARobotPhase = (actionPoints = defaultActionPoints):Phase => fightPhase(EntityIds.playerA, EntityIds.playerARobot, actionPoints)
export const playerBRobotPhase = (actionPoints = defaultActionPoints):Phase => fightPhase(EntityIds.playerB, EntityIds.playerBRobot, actionPoints)
export const playerATowerPhase = (actionPoints = defaultActionPoints):Phase => fightPhase(EntityIds.playerA, EntityIds.playerATower, actionPoints)
export const playerBTowerPhase = (actionPoints = defaultActionPoints):Phase => fightPhase(EntityIds.playerB, EntityIds.playerBTower, actionPoints)
export const victoryPhase = (currentPlayerId:string):Phase => ({ phaseType: PhaseType.Victory, currentPlayerId, currentUnitId: null, actionPoints: noActionPoint, auto: true })

export type Phasing = GenericComponent<'Phasing', {
    currentPhase: Phase
    readyPlayers:Set<string>
}>

const isPhasing = (component:Component): component is Phasing => {
    return component.componentType === 'Phasing'
}

export const toPhasing = (component:Component): Phasing => {
    if (isPhasing(component)) return component as Phasing
    throw new Error(componentIsNot(component, 'Phasing'))
}

export const makePhasing = (entityId:EntityId, currentPhase:Phase, readyPlayers:Set<string> = new Set()):Phasing => ({
    componentType: 'Phasing',
    entityId,
    currentPhase,
    readyPlayers
})

export const getCurrentUnitId = (phasing:Phasing):string => {
    if (phasing.currentPhase.currentUnitId) return phasing.currentPhase.currentUnitId
    throw new Error(missingCurrentUnitIdOnPhase(phasing.currentPhase))
}
