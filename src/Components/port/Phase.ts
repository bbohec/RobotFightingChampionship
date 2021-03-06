/* eslint-disable no-unused-vars */
export enum PhaseType {
    Prepare = 'Prepare',
    Placement = 'Placement',
    Fight = 'Fight',
    Victory = 'Victory',
}
export interface Phase {
    auto:boolean
    phaseType:PhaseType
    currentPlayerId:string|null,
    currentUnitId:string|null,
    actionPoints:number
}
