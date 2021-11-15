import { GenericComponent } from './GenericComponent'
import { ComponentName } from './port/ComponentName'

export class Hittable extends GenericComponent {
    constructor (entityId: string, hitPoints: number) {
        super(entityId)
        this.hitPoints = hitPoints
    }

    hitPoints: number;
    componentName: ComponentName = ComponentName.Hittable
}
