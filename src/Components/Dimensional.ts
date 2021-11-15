import { Dimension } from './port/Dimension'
import { GenericComponent } from './GenericComponent'
import { ComponentName } from './port/ComponentName'
export class Dimensional extends GenericComponent {
    constructor (entityId: string, dimensions: Dimension) {
        super(entityId)
        this.dimensions = dimensions
    }

    componentName: ComponentName = ComponentName.Dimensional
    dimensions: Dimension;
}
