import { GenericComponent } from './GenericComponent'

export class Hittable extends GenericComponent {
    constructor (entityId: string, hitPoints: number) {
        super(entityId)
        this.hitPoints = hitPoints
    }

    hitPoints: number;
}
