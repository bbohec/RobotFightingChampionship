import { DrawingPort } from '../port/DrawingPort'
export class InMemoryDrawingAdapter implements DrawingPort {
    eraseEntity (id:string): Promise<void> {
        const index = this.drawIds.findIndex(entityId => entityId === id)
        if (index < 0) throw new Error(`id '${id}' not found on drawIds`)
        this.drawIds.splice(index, 1)
        return Promise.resolve()
    }

    drawEntity (id:string): Promise<void> {
        const index = this.drawIds.findIndex(entityId => entityId === id)
        if (index > -1) throw new Error(`id '${id}' already draw`)
        this.drawIds.push(id)
        return Promise.resolve()
    }

    public drawIds:string[] = [];
}
