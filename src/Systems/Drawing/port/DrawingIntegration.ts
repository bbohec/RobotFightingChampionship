import { Dimension } from '../../../core/components/Dimensional'
import { Physical, Position } from '../../../core/components/Physical'

export interface DrawingIntegration {
    absolutePositionByEntityId (entityId: string): Position | null
    changeResolution(resolution:Dimension):void;
    retrieveResolution(): Dimension;
    eraseAll():void
    retrieveDrawnEntities(): Map<string, Physical>
    gridDimension:Dimension
}
