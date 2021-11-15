import { Dimension } from '../../../Components/port/Dimension'
import { Physical, Position } from '../../../Components/Physical'
import { idAlreadyDraw, idNotFoundOnDrawIds } from '../port/DrawingPort'
import { DrawingAdapter } from '../port/DrawingAdapter'
import { PixiApplicationCommon } from '../../Controller/infra/PixiApplication'

export class InMemoryDrawingAdapter extends PixiApplicationCommon implements DrawingAdapter {
    public updatePlayerPointerId (playerPointerId: string): Promise<void> {
        this.playerPointerId = playerPointerId
        return Promise.resolve()
    }

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
        if (entityPosition) return this.relativePositionToAbsolutePosition(entityPosition, 0.5, this.resolution)
        return null
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
    private resolution:Dimension = { x: 0, y: 0 }
}
