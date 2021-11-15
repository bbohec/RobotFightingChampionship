import { GenericComponent } from './GenericComponent'
import { ComponentName } from './port/ComponentName'
export class Playable extends GenericComponent {
    constructor (entityId: string, players:string[]) {
        super(entityId)
        this.players = players
    }

    players: string[] = [];
    componentName: ComponentName = ComponentName.Playable
}
export const maxPlayerPerMatch = 2
