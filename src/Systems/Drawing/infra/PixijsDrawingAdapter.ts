import { DrawingPort } from '../port/DrawingPort'

export class PixijsDrawingAdapter implements DrawingPort {
    eraseEntity (id: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    drawEntity (id: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
