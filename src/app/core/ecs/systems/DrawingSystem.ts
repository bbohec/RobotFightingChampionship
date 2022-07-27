
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { badPlayerEventNotificationMessage } from '../../events/notifyPlayer/notifyPlayer'
import { GenericClientSystem, GenericGameEventDispatcherSystem } from '../system'
import { Drawing } from '../../port/Drawing'
import { ComponentRepository } from '../../port/ComponentRepository'
import { EntityReference } from '../components/EntityReference'

export class DrawingSystem extends GenericClientSystem {
    constructor (componentRepository: ComponentRepository, gameEventDispatcher: GenericGameEventDispatcherSystem, drawingPort:Drawing) {
        super(componentRepository, gameEventDispatcher)
        this.drawingPort = drawingPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerEntityReferenceComponent = this.componentRepository
            .retrieveEntityReferences(undefined)
            .filter((entityReference):entityReference is EntityReference => !!entityReference)
            .find(entityReference => entityReference.entityType.includes(EntityType.player))
        const eventPlayerReference = this.entityByEntityType(gameEvent, EntityType.player)
        if (playerEntityReferenceComponent && eventPlayerReference === playerEntityReferenceComponent.entityId) return this.onPlayerEvent(gameEvent)
        throw new Error(badPlayerEventNotificationMessage(eventPlayerReference))
    }

    onPlayerEvent (gameEvent: GameEvent):Promise<void> {
        gameEvent.entityRefences.delete(EntityType.player)
        return gameEvent.action === Action.draw
            ? this.drawEntities(gameEvent)
            : Promise.reject(errorMessageOnUnknownEventAction(DrawingSystem.name, gameEvent))
    }

    drawEntities (gameEvent: GameEvent): Promise<void> {
        return Promise.all(Array.from(this.allEntities(gameEvent)).map(entityId => this.drawEntity(entityId, gameEvent)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    drawEntity (entityId: string, gameEvent: GameEvent): Promise<void> {
        const component = this.retrievePhysical(gameEvent, entityId)
        return this.drawingPort.refreshEntity(component)
    }

    hideEntities (gameEvent: GameEvent):Promise<void> {
        return Promise.all(Array.from(this.allEntities(gameEvent)).map(entityId => this.drawingPort.refreshEntity(this.retrievePhysical(gameEvent, entityId))))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private drawingPort: Drawing
}
