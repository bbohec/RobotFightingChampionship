import { Dimension, gridDimension } from '../../../Components/port/Dimension'
import { Position, position } from '../../../Components/Physical'
import { EventBus } from '../../../Event/port/EventBus'
import { updatePointerPosition } from '../../../Events/updatePointerPosition/updatePointerPosition'
export interface ScaleRatio {
    x:number
    y:number
}
export abstract class CommonDrawingAdapter {
    constructor (eventBus:EventBus) {
        this.eventBus = eventBus
    }

    protected relativePositionToAbsolutePosition (entityRelativePosition: Position, offset:number): Position {
        const scaleRatio = this.retrieveScaleRatio()
        return position(
            entityRelativePosition.x * scaleRatio.x + offset * scaleRatio.x,
            entityRelativePosition.y * scaleRatio.y + offset * scaleRatio.y
        )
    }

    protected absolutePositionToRelativePosition (entityRelativePosition: Position): Position {
        const scaleRatio = this.retrieveScaleRatio()
        return position(
            entityRelativePosition.x / scaleRatio.x - this.offset / scaleRatio.x,
            entityRelativePosition.y / scaleRatio.y - this.offset / scaleRatio.y
        )
    }

    protected sendUpdatePlayerPointerPositionGameEvent (playerPointerPosition:Position):Promise<void> {
        return (this.playerPointerId)
            ? this.eventBus.send(updatePointerPosition(this.playerPointerId, this.absolutePositionToRelativePosition(playerPointerPosition)))
            : Promise.reject(new Error('Player pointer id is undefined.'))
    }

    private retrieveScaleRatio (): ScaleRatio {
        return {
            x: this.resolution.x / this.gridDimension.x,
            y: this.resolution.y / this.gridDimension.y
        }
    }

    abstract updatePlayerPointerId(playerPointerId:string):Promise<void>

    protected playerPointerId:string|undefined
    protected offset:number = 0
    public gridDimension: Dimension = gridDimension;
    protected resolution: Dimension = { x: 0, y: 0 };
    private eventBus: EventBus
}
