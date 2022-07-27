import { Dimension } from '../../app/core/components/Dimensional'
import { Position, Physical } from '../../app/core/components/Physical'

export interface DrawingIntegration {
    absolutePositionByEntityId (entityId: string): Position | null
    changeResolution(resolution:Dimension):void;
    retrieveResolution(): Dimension;
    eraseAll():void
    retrieveDrawnEntities(): Map<string, Physical>
    gridDimension:Dimension
}
