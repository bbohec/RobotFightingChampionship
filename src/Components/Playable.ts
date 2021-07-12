import { GenericComponent } from './GenericComponent'
export class Playable extends GenericComponent {
    constructor (entityId: string, players:string[]) {
        super(entityId)
        this.players = players
    }

    players: string[] = [];
}
