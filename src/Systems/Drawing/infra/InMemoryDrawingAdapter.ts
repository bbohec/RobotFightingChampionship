
import { Physical } from '../../../Components/Physical'
import { DrawingPort, idAlreadyDraw, idNotFoundOnDrawIds } from '../port/DrawingPort'

export class InMemoryDrawingAdapter implements DrawingPort {
    eraseEntity (entityId:string): Promise<void> {
        if (!this.drawEntities.has(entityId)) throw new Error(idNotFoundOnDrawIds(entityId))
        this.drawEntities.delete(entityId)
        return Promise.resolve()
    }

    drawEntity (physicalComponent:Physical): Promise<void> {
        if (this.drawEntities.has(physicalComponent.entityId)) throw new Error(idAlreadyDraw(physicalComponent.entityId))
        this.drawEntities.set(physicalComponent.entityId, physicalComponent)
        return Promise.resolve()
    }

    public drawEntities:Map<string, Physical> = new Map();
}
