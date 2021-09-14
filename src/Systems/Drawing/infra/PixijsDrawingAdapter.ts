import { DrawingPort, methodNotImplemented } from '../port/DrawingPort'
export class PixijsDrawingAdapter implements DrawingPort {
    eraseEntity (id: string): Promise<void> {
        throw new Error(methodNotImplemented)
    }

    drawEntity (id: string): Promise<void> {
        throw new Error(methodNotImplemented)
    }
}
