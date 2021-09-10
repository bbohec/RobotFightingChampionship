import { GenericComponent } from './GenericComponent'
import { MatchPlayer, Phase, PhaseType } from './port/Phase'

const noActionPoint = 0
export const defaultActionPoints = 12
export const weaponAttackActionPoints = 4

export const preparingGamePhase = ():Phase => ({ phaseType: PhaseType.PreparingGame, matchPlayer: null, actionPoints: noActionPoint })
export const playerATowerPlacementPhase = ():Phase => ({ phaseType: PhaseType.TowerPlacement, matchPlayer: MatchPlayer.A, actionPoints: noActionPoint })
export const playerARobotPlacementPhase = ():Phase => ({ phaseType: PhaseType.RobotPlacement, matchPlayer: MatchPlayer.A, actionPoints: noActionPoint })
export const playerBTowerPlacementPhase = ():Phase => ({ phaseType: PhaseType.TowerPlacement, matchPlayer: MatchPlayer.B, actionPoints: noActionPoint })
export const playerBRobotPlacementPhase = ():Phase => ({ phaseType: PhaseType.RobotPlacement, matchPlayer: MatchPlayer.B, actionPoints: noActionPoint })
export const playerARobotPhase = ():Phase => ({ phaseType: PhaseType.Robot, matchPlayer: MatchPlayer.A, actionPoints: defaultActionPoints })
export const playerBRobotPhase = ():Phase => ({ phaseType: PhaseType.Robot, matchPlayer: MatchPlayer.B, actionPoints: defaultActionPoints })
export const playerATowerPhase = (actionPoints = defaultActionPoints):Phase => ({ phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints })
export const playerBTowerPhase = ():Phase => ({ phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.B, actionPoints: defaultActionPoints })
export const playerAVictoryPhase = ():Phase => ({ phaseType: PhaseType.Victory, matchPlayer: MatchPlayer.A, actionPoints: noActionPoint })
export const playerBVictoryPhase = ():Phase => ({ phaseType: PhaseType.Victory, matchPlayer: MatchPlayer.B, actionPoints: noActionPoint })

export class Phasing extends GenericComponent {
    constructor (entityId:string, phase:Phase, readyPlayers:Set<string> = new Set([])) {
        super(entityId)
        this.currentPhase = phase
        this.readyPlayers = readyPlayers
    }

    currentPhase: Phase
    readyPlayers:Set<string>
}
