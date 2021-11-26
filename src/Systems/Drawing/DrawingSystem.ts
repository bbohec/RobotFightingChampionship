import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { DrawingPort } from './port/DrawingPort'
import { EntityInteractor } from '../../Entities/ports/EntityInteractor'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { Action } from '../../Event/Action'
import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'
import { badPlayerEventNotificationMessage } from '../../Events/notify/notify'
import { Physical } from '../../Components/Physical'
import { GenericClientSystem } from '../Generic/GenericClientSystem'
export class DrawingSystem extends GenericClientSystem {
    constructor (interactWithEntities: EntityInteractor, gameEventDispatcher: GenericGameEventDispatcherSystem, drawingPort:DrawingPort) {
        super(interactWithEntities, gameEventDispatcher)
        this.drawingPort = drawingPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerEntityReferenceComponent = this.interactWithEntities
            .retrieveEntitiesThatHaveComponent(EntityReference)
            .map(entity => this.interactWithEntities.retrieveEntityComponentByEntityId(entity.id, EntityReference))
            .find(entityReference => entityReference.entityType.includes(EntityType.player))
        const eventPlayerReference = gameEvent.entityByEntityType(EntityType.player)
        if (playerEntityReferenceComponent && eventPlayerReference === playerEntityReferenceComponent.entityId) return this.onPlayerEvent(gameEvent)
        throw new Error(badPlayerEventNotificationMessage(eventPlayerReference))
    }

    onPlayerEvent (gameEvent: GameEvent):Promise<void> {
        gameEvent.entityRefences.delete(EntityType.player)
        if (gameEvent.action === Action.draw) return this.drawEntities(gameEvent)
        throw errorMessageOnUnknownEventAction(DrawingSystem.name, gameEvent)
    }

    drawEntities (gameEvent: GameEvent): Promise<void> {
        return Promise.all(Array.from(gameEvent.allEntities()).map(entityId => this.drawEntity(entityId, gameEvent)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    drawEntity (entityId: string, gameEvent: GameEvent): Promise<void> {
        return this.drawingPort.refreshEntity(gameEvent.retrieveComponent(entityId, Physical))
    }

    hideEntities (gameEvent: GameEvent):Promise<void> {
        return Promise.all(Array.from(gameEvent.allEntities()).map(entityId => this.drawingPort.refreshEntity(gameEvent.retrieveComponent(entityId, Physical))))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private drawingPort: DrawingPort
}
