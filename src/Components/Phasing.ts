import { EntityId } from '../Entities/Entity'
import { EntityIds } from '../Event/entityIds'
import { GenericComponent } from './port/Component'
import { Phase, PhaseType } from './port/Phase'
const noActionPoint = 0
export const defaultActionPoints = 12
export const weaponAttackActionPoints = 4
export const placementActionPoints = 1000
export const preparingGamePhase:Phase = ({ phaseType: PhaseType.Prepare, currentPlayerId: null, currentUnitId: null, actionPoints: noActionPoint, auto: true })
export const placementPhase = (currentPlayerId:string, currentUnitId:string, auto:boolean):Phase => ({ phaseType: PhaseType.Placement, currentPlayerId, currentUnitId, actionPoints: placementActionPoints, auto })
export const playerATowerManualPlacementPhase = ():Phase => placementPhase(EntityIds.playerA, EntityIds.playerATower, false)
export const playerATowerAutoPlacementPhase = ():Phase => placementPhase(EntityIds.playerA, EntityIds.playerATower, true)
export const playerARobotManualPlacementPhase = () :Phase => placementPhase(EntityIds.playerA, EntityIds.playerARobot, false)
export const playerARobotAutoPlacementPhase = () :Phase => placementPhase(EntityIds.playerA, EntityIds.playerARobot, true)
export const playerBTowerManualPlacementPhase = () :Phase => placementPhase(EntityIds.playerB, EntityIds.playerBTower, false)
export const playerBTowerAutoPlacementPhase = () :Phase => placementPhase(EntityIds.playerB, EntityIds.playerBTower, true)
export const playerBRobotManualPlacementPhase = () :Phase => placementPhase(EntityIds.playerB, EntityIds.playerBRobot, false)
export const playerBRobotAutoPlacementPhase = () :Phase => placementPhase(EntityIds.playerB, EntityIds.playerBRobot, true)
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

function missingCurrentUnitIdOnPhase (currentPhase: Phase): string | undefined {
    return `Missing currentUnitId on phase ${currentPhase.phaseType}.`
}
