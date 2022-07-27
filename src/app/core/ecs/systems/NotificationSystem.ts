import { EntityInteractor } from '../../port/EntityInteractor'
import { EntityType } from '../../type/EntityType'
import { GameEvent } from '../../type/GameEvent'
import { wrongPlayerNotificationMessage } from '../../events/notifyPlayer/notifyPlayer'
import { GenericClientSystem, GenericGameEventDispatcherSystem } from '../system'
import { NotificationPort } from '../../port/Notification'

export class NotificationSystem extends GenericClientSystem {
    constructor (interactWithEntities: EntityInteractor, gameEventDispatcher: GenericGameEventDispatcherSystem, notificationPort:NotificationPort) {
        super(interactWithEntities, gameEventDispatcher)
        this.notificationPort = notificationPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerEntityReference = this.interactWithEntities
            .retrieveEntitiesThatHaveComponent('EntityReference')
            .map(entity => {
                const entityReference = entity.retrieveEntityReference()
                if (!entityReference) throw new Error('EntityReference component not found for entity ' + entity.id)
                return entityReference
            })
            .find(entityReferenceComponent => entityReferenceComponent.entityType.includes(EntityType.player))
        const message = this.entityByEntityType(gameEvent, EntityType.message)
        const eventPlayerId = this.entityByEntityType(gameEvent, EntityType.player)
        return this.notificationPort.notify(playerEntityReference && playerEntityReference.entityId === eventPlayerId
            ? message
            : wrongPlayerNotificationMessage(eventPlayerId, message)
        )
    }

    notificationPort: NotificationPort
}
