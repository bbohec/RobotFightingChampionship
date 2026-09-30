import type { Application, FederatedPointerEvent } from 'pixi.js'
import type { Dimension } from '../../core/ecs/components/Dimensional'
import { type Position, position } from '../../core/ecs/components/Physical'
import { updatePointerPosition } from '../../core/events/updatePointerPosition/updatePointerPosition'
import type { ControllerPort } from '../../core/port/ControllerPort'
import type { EventBus } from '../../core/port/EventBus'
import type { Logger } from '../../core/port/Logger'
import { PixiApplicationCommon } from '../pixi/PixiApplicationCommon'
import { PixiEvent } from '../pixi/PixiEvent'

export interface ScaleRatio {
  x: number
  y: number
}

export class PixijsControllerAdapter extends PixiApplicationCommon implements ControllerPort {
  constructor(eventBus: EventBus, applicationInstance: Application, logger: Logger) {
    super()
    this.applicationInstance = applicationInstance
    this.eventBus = eventBus
    this.logger = logger
  }

  activate(pointerId: string): Promise<void> {
    return this.loadPixijsEvents(pointerId)
  }

  private loadPixijsEvents(playerPointerId: string): Promise<void> {
    this.playerPointerId = playerPointerId
    const stage = this.applicationInstance.stage
    stage.eventMode = 'static'
    stage.cursor = 'pointer'
    stage.on(PixiEvent.MOUSE_DOWN, (event: FederatedPointerEvent) =>
      this.onPixiEventMouseDown(event),
    )
    return Promise.resolve()
  }

  private onPixiEventMouseDown(event: FederatedPointerEvent): Promise<void> {
    return this.sendUpdatePlayerPointerPositionGameEvent(position(event.global.x, event.global.y))
  }

  private retrieveResolution(): Dimension {
    return {
      x: this.applicationInstance.renderer.screen.width,
      y: this.applicationInstance.renderer.screen.height,
    }
  }

  private sendUpdatePlayerPointerPositionGameEvent(playerPointerPosition: Position): Promise<void> {
    return this.playerPointerId
      ? this.eventBus.send(
          updatePointerPosition(
            this.playerPointerId,
            this.absolutePositionToRelativePosition(
              playerPointerPosition,
              this.retrieveResolution(),
            ),
          ),
        )
      : Promise.reject(new Error('Player pointer id is undefined.'))
  }

  private eventBus: EventBus
  private applicationInstance: Application
  private logger: Logger
}
