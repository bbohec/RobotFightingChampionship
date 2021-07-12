import { GenericComponent } from './GenericComponent'
import { PhaseType } from './port/Phase'
export class Phasing extends GenericComponent {
    constructor (entityId:string, phase:PhaseType, readyPlayers:Set<string> = new Set([])) {
        super(entityId)
        this.currentPhase = phase
        this.readyPlayers = readyPlayers
    }

    currentPhase: PhaseType
    readyPlayers:Set<string>
}
