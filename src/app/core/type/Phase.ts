import { PhaseType } from './PhaseType'

export interface Phase {
    auto: boolean;
    phaseType: PhaseType;
    currentPlayerId: string | null;
    currentUnitId: string | null;
    actionPoints: number;
}
