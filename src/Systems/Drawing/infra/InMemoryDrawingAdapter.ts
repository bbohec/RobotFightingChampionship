import { Dimension, gridDimension } from '../../../Components/port/Dimension'
import { Physical, Position, position } from '../../../Components/Physical'
import { idAlreadyDraw, idNotFoundOnDrawIds } from '../port/DrawingPort'
import { DrawingAdapter } from '../port/DrawingAdapter'

export class InMemoryDrawingAdapter implements DrawingAdapter {
    public retrieveDrawnEntities (): Map<string, Physical> {
        return this.drawEntities
    }

    public eraseAll (): void {
        this.drawEntities.clear()
    }

    public retrieveResolution (): Dimension {
        return this.resolution
    }

    public changeResolution (resolution: Dimension): void {
        this.resolution = resolution
    }

    public absolutePositionByEntityId (entityId: string): Position|null {
        const entityPosition = this.drawEntities.get(entityId)?.position
        if (entityPosition) return this.relativePositionToAbsolutePosition(entityPosition)
        return null
    }

    public relativePositionToAbsolutePosition (entityRelativePosition: Position): Position {
        const scalingRatio = this.resolution.x / this.gridDimension.x
        const offset = 0.5 * scalingRatio
        return position(Math.floor(entityRelativePosition.x * scalingRatio + offset), Math.floor(entityRelativePosition.y * scalingRatio + offset))
    }

    public eraseEntity (entityId:string): Promise<void> {
        if (!this.drawEntities.has(entityId)) throw new Error(idNotFoundOnDrawIds(entityId))
        this.drawEntities.delete(entityId)
        return Promise.resolve()
    }

    public drawEntity (physicalComponent:Physical): Promise<void> {
        if (this.drawEntities.has(physicalComponent.entityId)) throw new Error(idAlreadyDraw(physicalComponent.entityId))
        this.drawEntities.set(physicalComponent.entityId, physicalComponent)
        return Promise.resolve()
    }

    public drawEntities:Map<string, Physical> = new Map();
    public gridDimension: Dimension = gridDimension
    private resolution: Dimension = { x: 0, y: 0 }
}
