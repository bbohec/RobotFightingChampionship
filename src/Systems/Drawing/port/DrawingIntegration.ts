import { Dimension } from '../../../Components/port/Dimension'
import { Physical, Position } from '../../../Components/Physical'

export interface DrawingIntegration {
    absolutePositionByEntityId (entityId: string): Position | null
    changeResolution(resolution:Dimension):void;
    retrieveResolution(): Dimension;
    eraseAll():void
    retrieveDrawnEntities(): Map<string, Physical>
    gridDimension:Dimension
}
