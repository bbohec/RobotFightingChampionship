import { GenericComponent } from './GenericComponent'
import { Phase } from './port/Phase'
export class Phasing extends GenericComponent {
    currentPhase: Phase = Phase.PreparingGame;
    readyPlayers:Set<string> = new Set([])
}
