import { GenericComponent } from './GenericComponent'
import { ComponentName } from './port/ComponentName'
export class Offensive extends GenericComponent {
    constructor (entityId: string, damagePoints: number) {
        super(entityId)
        this.damagePoints = damagePoints
    }

    damagePoints: number;
    componentName: ComponentName= ComponentName.Offensive
}
