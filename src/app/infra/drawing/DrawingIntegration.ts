import { Dimension } from '../../core/ecs/components/Dimensional'
import { Position, Physical } from '../../core/ecs/components/Physical'

export interface DrawingIntegration {
    absolutePositionByEntityId (entityId: string): Position | null
    changeResolution(resolution:Dimension):void;
    retrieveResolution(): Dimension;
    eraseAll():void
    retrieveDrawnEntities(): Map<string, Physical>
    gridDimension:Dimension
}
