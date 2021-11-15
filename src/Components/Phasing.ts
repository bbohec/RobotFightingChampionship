import { EntityId } from '../Event/entityIds'
import { GenericComponent } from './GenericComponent'
import { ComponentName } from './port/ComponentName'
import { Phase, PhaseType } from './port/Phase'
const noActionPoint = 0
export const defaultActionPoints = 12
export const weaponAttackActionPoints = 4
export const preparingGamePhase:Phase = ({ phaseType: PhaseType.Prepare, currentPlayerId: null, currentUnitId: null, actionPoints: noActionPoint })
export const placementPhase = (currentPlayerId:string, currentUnitId:string):Phase => ({ phaseType: PhaseType.Placement, currentPlayerId, currentUnitId, actionPoints: noActionPoint })
export const playerATowerPlacementPhase:Phase = placementPhase(EntityId.playerA, EntityId.playerATower)
export const playerARobotPlacementPhase :Phase = placementPhase(EntityId.playerA, EntityId.playerARobot)
export const playerBTowerPlacementPhase :Phase = placementPhase(EntityId.playerB, EntityId.playerBTower)
export const playerBRobotPlacementPhase :Phase = placementPhase(EntityId.playerB, EntityId.playerBRobot)
export const fightPhase = (currentPlayerId:string, currentUnitId:string, actionPoints = defaultActionPoints):Phase => ({ phaseType: PhaseType.Fight, currentPlayerId, currentUnitId, actionPoints })
export const playerARobotPhase = (actionPoints = defaultActionPoints):Phase => fightPhase(EntityId.playerA, EntityId.playerARobot, actionPoints)
export const playerBRobotPhase = (actionPoints = defaultActionPoints):Phase => fightPhase(EntityId.playerB, EntityId.playerBRobot, actionPoints)
export const playerATowerPhase = (actionPoints = defaultActionPoints):Phase => fightPhase(EntityId.playerA, EntityId.playerATower, actionPoints)
export const playerBTowerPhase = (actionPoints = defaultActionPoints):Phase => fightPhase(EntityId.playerB, EntityId.playerBTower, actionPoints)
export const victoryPhase = (currentPlayerId:string):Phase => ({ phaseType: PhaseType.Victory, currentPlayerId, currentUnitId: null, actionPoints: noActionPoint })
export const playerAVictoryPhase :Phase = victoryPhase(EntityId.playerA)
export const playerBVictoryPhase :Phase = victoryPhase(EntityId.playerB)
export class Phasing extends GenericComponent {
    constructor (entityId:string, phase:Phase, readyPlayers:Set<string> = new Set([])) {
        super(entityId)
        this.currentPhase = phase
        this.readyPlayers = readyPlayers
    }

    public getCurrentUnitId ():string {
        if (this.currentPhase.currentUnitId) return this.currentPhase.currentUnitId
        throw new Error(missingCurrentUnitIdOnPhase(this.currentPhase))
    }

    currentPhase: Phase
    readyPlayers:Set<string>
    componentName: ComponentName = ComponentName.Phasing
}

function missingCurrentUnitIdOnPhase (currentPhase: Phase): string | undefined {
    return `Missing currentUnitId on phase ${currentPhase.phaseType}.`
}
