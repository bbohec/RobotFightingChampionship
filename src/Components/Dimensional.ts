import { Dimension } from './port/Dimension'
import { GenericComponent } from './GenericComponent'
export class Dimensional extends GenericComponent {
    constructor (entityId: string, dimensions: Dimension) {
        super(entityId)
        this.dimensions = dimensions
    }

    dimensions: Dimension;
}
