import { Application, InteractionEvent } from 'pixi.js'
import { Dimension } from '../../app/core/components/Dimensional'
import { position, Position } from '../../app/core/components/Physical'
import { updatePointerPosition } from '../../app/core/events/updatePointerPosition/updatePointerPosition'
import { ControllerPort } from '../../app/core/port/ControllerPort'
import { EventBus } from '../../app/core/port/EventBus'
import { Logger } from '../../app/core/port/Logger'
import { PixiApplicationCommon } from '../pixi/PixiApplicationCommon'
import { PixiEvent } from '../pixi/PixiEvent'

export interface ScaleRatio {
    x:number
    y:number
}

export class PixijsControllerAdapter extends PixiApplicationCommon implements ControllerPort {
    constructor (eventBus:EventBus, applicationInstance:Application, logger:Logger) {
        super()
        this.applicationInstance = applicationInstance
        this.eventBus = eventBus
        this.logger = logger
    }

    activate (pointerId: string): Promise<void> {
        return this.loadPixijsEvents(pointerId)
    }

    private loadPixijsEvents (playerPointerId:string):Promise<void> {
        this.playerPointerId = playerPointerId
        const stage = this.applicationInstance.stage
        stage.interactive = true
        stage.buttonMode = true
        stage.on(PixiEvent.MOUSE_DOWN, (event:InteractionEvent) => this.onPixiEventMouseDown(event))
        return Promise.resolve()
    }

    private onPixiEventMouseDown (event: InteractionEvent): Promise<void> {
        return this.sendUpdatePlayerPointerPositionGameEvent(position(event.data.global.x, event.data.global.y))
    }

    private retrieveResolution (): Dimension {
        return { x: this.applicationInstance.renderer.view.width, y: this.applicationInstance.renderer.view.height }
    }

    private sendUpdatePlayerPointerPositionGameEvent (playerPointerPosition:Position):Promise<void> {
        return (this.playerPointerId)
            ? this.eventBus.send(updatePointerPosition(this.playerPointerId, this.absolutePositionToRelativePosition(playerPointerPosition, this.retrieveResolution())))
            : Promise.reject(new Error('Player pointer id is undefined.'))
    }

    private eventBus: EventBus
    private applicationInstance: Application
    private logger:Logger
}
