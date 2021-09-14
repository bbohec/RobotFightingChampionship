import { DrawingPort, idAlreadyDraw, idNotFoundOnDrawIds } from '../port/DrawingPort'

export class InMemoryDrawingAdapter implements DrawingPort {
    eraseEntity (id:string): Promise<void> {
        const index = this.drawIds.findIndex(entityId => entityId === id)
        if (index < 0) throw new Error(idNotFoundOnDrawIds(id))
        this.drawIds.splice(index, 1)
        return Promise.resolve()
    }

    drawEntity (id:string): Promise<void> {
        if (this.drawIds.findIndex(entityId => entityId === id) > -1) throw new Error(idAlreadyDraw(id))
        this.drawIds.push(id)
        return Promise.resolve()
    }

    public drawIds:string[] = [];
}
