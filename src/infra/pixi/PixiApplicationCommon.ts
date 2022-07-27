
import { Dimension, gameScreenDimension } from '../../app/core/components/Dimensional'
import { Position, position } from '../../app/core/components/Physical'
import { ScaleRatio } from '../controller/PixijsControllerAdapter'

export abstract class PixiApplicationCommon {
    protected relativePositionToAbsolutePosition (entityRelativePosition: Position, offset: number, resolution: Dimension): Position {
        const scaleRatio = this.retrieveScaleRatio(resolution)
        return position(
            entityRelativePosition.x * scaleRatio.x + offset * scaleRatio.x,
            entityRelativePosition.y * scaleRatio.y + offset * scaleRatio.y
        )
    }

    protected absolutePositionToRelativePosition (entityRelativePosition: Position, resolution: Dimension): Position {
        const scaleRatio = this.retrieveScaleRatio(resolution)
        const relativePosition = position(
            entityRelativePosition.x / scaleRatio.x - this.offset / scaleRatio.x,
            entityRelativePosition.y / scaleRatio.y - this.offset / scaleRatio.y
        )
        return relativePosition
    }

    private retrieveScaleRatio (resolution: Dimension): ScaleRatio {
        return {
            x: resolution.x / this.gridDimension.x,
            y: resolution.y / this.gridDimension.y
        }
    }

    public gridDimension: Dimension = gameScreenDimension;
    public offset: number = 0;
    public playerPointerId: string | undefined;
}
