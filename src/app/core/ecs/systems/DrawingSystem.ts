import { EntityType } from '../../ecs/components/EntityReference'
import { badPlayerEventNotificationMessage } from '../../events/notifyPlayer/notifyPlayer'
import type { ComponentRepository } from '../../port/ComponentRepository'
import type { Drawing } from '../../port/Drawing'
import { EventKind } from '../../type/EventKind'
import { errorMessageOnUnknownEventAction, type GameEvent } from '../../type/GameEvent'
import type { EntityReference } from '../components/EntityReference'
import { GenericClientSystem, type GenericGameEventDispatcherSystem } from '../system'

export class DrawingSystem extends GenericClientSystem {
  constructor(
    componentRepository: ComponentRepository,
    gameEventDispatcher: GenericGameEventDispatcherSystem,
    drawingPort: Drawing,
  ) {
    super(componentRepository, gameEventDispatcher)
    this.drawingPort = drawingPort
  }

  onGameEvent(gameEvent: GameEvent): Promise<void> {
    const playerEntityReferenceComponent = this.componentRepository
      .retrieveEntityReferences(undefined)
      .filter((entityReference): entityReference is EntityReference => !!entityReference)
      .find((entityReference) => entityReference.entityType.includes(EntityType.player))
    const eventPlayerReference = this.entityByEntityType(gameEvent, EntityType.player)
    if (
      playerEntityReferenceComponent &&
      eventPlayerReference === playerEntityReferenceComponent.entityId
    )
      return this.onPlayerEvent(gameEvent)
    throw new Error(badPlayerEventNotificationMessage(eventPlayerReference))
  }

  onPlayerEvent(gameEvent: GameEvent): Promise<void> {
    gameEvent.entityRefences.delete(EntityType.player)
    return gameEvent.action === EventKind.draw
      ? this.drawEntities(gameEvent)
      : Promise.reject(errorMessageOnUnknownEventAction(DrawingSystem.name, gameEvent))
  }

  drawEntities(gameEvent: GameEvent): Promise<void> {
    return Promise.all(
      Array.from(this.allEntities(gameEvent)).map((entityId) =>
        this.drawEntity(entityId, gameEvent),
      ),
    )
      .then(() => Promise.resolve())
      .catch((error) => Promise.reject(error))
  }

  drawEntity(entityId: string, gameEvent: GameEvent): Promise<void> {
    const component = this.retrievePhysical(gameEvent, entityId)
    return this.drawingPort.refreshEntity(component)
  }

  hideEntities(gameEvent: GameEvent): Promise<void> {
    return Promise.all(
      Array.from(this.allEntities(gameEvent)).map((entityId) =>
        this.drawingPort.refreshEntity(this.retrievePhysical(gameEvent, entityId)),
      ),
    )
      .then(() => Promise.resolve())
      .catch((error) => Promise.reject(error))
  }

  private drawingPort: Drawing
}
