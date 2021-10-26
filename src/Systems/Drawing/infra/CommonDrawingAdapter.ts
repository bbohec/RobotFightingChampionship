import { Dimension, gridDimension } from '../../../Components/port/Dimension'
import { Position, position } from '../../../Components/Physical'
export interface ScaleRatio {
    x:number
    y:number
}
export abstract class CommonDrawingAdapter {
    protected relativePositionToAbsolutePosition (entityRelativePosition: Position, offset:number): Position {
        const scaleRatio:ScaleRatio = {
            x: this.resolution.x / this.gridDimension.x,
            y: this.resolution.y / this.gridDimension.y
        }
        return position(
            entityRelativePosition.x * scaleRatio.x + offset * scaleRatio.x,
            entityRelativePosition.y * scaleRatio.y + offset * scaleRatio.y
        )
    }

    public gridDimension: Dimension = gridDimension;
    protected resolution: Dimension = { x: 0, y: 0 };
}
