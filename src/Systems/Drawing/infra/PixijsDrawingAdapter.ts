import { Physical } from '../../../Components/Physical'
import { DrawingPort, methodNotImplemented } from '../port/DrawingPort'
export class PixijsDrawingAdapter implements DrawingPort {
    drawEntity (physicalComponent: Physical): Promise<void> {
        throw new Error('Method not implemented.')
    }

    eraseEntity (id: string): Promise<void> {
        throw new Error(methodNotImplemented)
    }
}
