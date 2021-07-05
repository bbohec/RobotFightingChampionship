import { GenericComponent } from './GenericComponent'
import { Phase } from './port/Phase'
export class Phasing extends GenericComponent {
    constructor (entityId:string, phase:Phase, readyPlayers:Set<string> = new Set([])) {
        super(entityId)
        this.currentPhase = phase
        this.readyPlayers = readyPlayers
    }

    currentPhase: Phase
    readyPlayers:Set<string>
}
