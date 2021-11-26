import { GenericComponent } from './GenericComponent'
export class Offensive extends GenericComponent {
    constructor (entityId: string, damagePoints: number) {
        super(entityId)
        this.damagePoints = damagePoints
    }

    damagePoints: number;
}
