/* eslint-disable no-unused-vars */
export enum MatchPlayer {
    A='Player A',
    B='Player B'
}

export enum PhaseType {
    PreparingGame = 'Preparing Game',
    TowerPlacement = 'Tower Placement',
    RobotPlacement = 'Robot Placement',
    Tower = 'Tower',
    Robot = 'Robot',
    Victory = 'Victory',
}
export interface Phase {
    phaseType:PhaseType
    matchPlayer:MatchPlayer|null
    actionPoints:number
}
