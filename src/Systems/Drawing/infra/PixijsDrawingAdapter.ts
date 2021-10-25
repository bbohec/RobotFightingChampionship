import { Dimension, gridDimension } from '../../../Components/port/Dimension'
import { Physical, Position } from '../../../Components/Physical'
import { methodNotImplemented } from '../port/DrawingPort'
import { DrawingAdapter } from '../port/DrawingAdapter'
import { Application, Sprite } from 'pixi.js'

export class PixijsDrawingAdapter implements DrawingAdapter {
    retrieveDrawnEntities (): Map<string, Physical> {
        throw new Error(methodNotImplemented)
    }

    eraseAll (): void {
    }

    changeResolution (resolution: Dimension): void {
        throw new Error(methodNotImplemented)
    }

    retrieveResolution (): Dimension {
        throw new Error(methodNotImplemented)
    }

    absolutePositionByEntityId (entityId: string): Position {
        throw new Error(methodNotImplemented)
    }

    drawEntity (physicalComponent: Physical): Promise<void> {
        // this.pixiApp.stage.addChild(this.sprite)
        throw new Error(methodNotImplemented)
    }

    eraseEntity (id: string): Promise<void> {
        throw new Error(methodNotImplemented)
    }

    addingViewToDom (htmlElement:HTMLElement):void {
        // htmlElement.appendChild(this.pixiApp.view)
        throw new Error(methodNotImplemented)
    }

    private sprite = Sprite.from('sample.png')

    gridDimension: Dimension = gridDimension
    resolution: Dimension = { x: 0, y: 0 }
    private pixiApp = new Application({ width: this.resolution.x, height: this.resolution.y })
}
