import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { DrawingPort } from './port/DrawingPort'
import { EntityInteractor } from '../../Entities/ports/EntityInteractor'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { Action } from '../../Event/Action'
import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'
import { badPlayerEventNotificationMessage } from '../../Events/notifyPlayer/notifyPlayer'
import { GenericClientSystem } from '../Generic/GenericClientSystem'
import { Physical } from '../../Components/Physical'
export class DrawingSystem extends GenericClientSystem {
    constructor (interactWithEntities: EntityInteractor, gameEventDispatcher: GenericGameEventDispatcherSystem, drawingPort:DrawingPort) {
        super(interactWithEntities, gameEventDispatcher)
        this.drawingPort = drawingPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerEntityReferenceComponent = this.interactWithEntities
            .retrieveEntitiesThatHaveComponent('EntityReference')
            .map(entity => this.interactWithEntities.retrieveComponent<EntityReference>(entity.id))
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
        const component = this.retrieveComponent<Physical>(gameEvent, entityId)
        return this.drawingPort.refreshEntity(component)
    }

    hideEntities (gameEvent: GameEvent):Promise<void> {
        return Promise.all(Array.from(this.allEntities(gameEvent)).map(entityId => this.drawingPort.refreshEntity(this.retrieveComponent<Physical>(gameEvent, entityId))))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private drawingPort: DrawingPort
}
