import { EntityReference } from '../../Components/EntityReference'
import { EntityInteractor } from '../../Entities/ports/EntityInteractor'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { wrongPlayerNotificationMessage } from '../../Events/notify/notify'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { GenericClientSystem } from '../Generic/GenericClientSystem'
import { NotificationPort } from './port/NotificationPort'

export class NotificationSystem extends GenericClientSystem {
    constructor (interactWithEntities: EntityInteractor, gameEventDispatcher: GenericGameEventDispatcherSystem, notificationPort:NotificationPort) {
        super(interactWithEntities, gameEventDispatcher)
        this.notificationPort = notificationPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerEntityReference = this.interactWithEntities
            .retrieveEntitiesThatHaveComponent(EntityReference)
            .map(entity => entity.retrieveComponent(EntityReference))
            .find(entityReferenceComponent => entityReferenceComponent.entityType.includes(EntityType.player))
        const message = gameEvent.entityByEntityType(EntityType.message)
        const eventPlayerId = gameEvent.entityByEntityType(EntityType.player)
        return this.notificationPort.notify(playerEntityReference && playerEntityReference.entityId === eventPlayerId
            ? message
            : wrongPlayerNotificationMessage(eventPlayerId, message)
        )
    }

    notificationPort: NotificationPort
}
