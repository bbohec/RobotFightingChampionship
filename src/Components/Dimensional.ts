import { GenericComponent } from './GenericComponent'
export interface Dimension {
    x:number,
    y:number
}
export class Dimensional extends GenericComponent {
    constructor (entityId: string, dimensions: Dimension) {
        super(entityId)
        this.dimensions = dimensions
    }

    dimensions: Dimension;
}
