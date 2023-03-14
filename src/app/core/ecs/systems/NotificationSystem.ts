import { EntityType } from '../../type/EntityType'
import { GameEvent } from '../../type/GameEvent'
import { wrongPlayerNotificationMessage } from '../../events/notifyPlayer/notifyPlayer'
import { GenericClientSystem, GenericGameEventDispatcherSystem } from '../system'
import { NotificationPort } from '../../port/Notification'
import { ComponentRepository } from '../../port/ComponentRepository'
import { EntityReference } from '../components/EntityReference'

export class NotificationSystem extends GenericClientSystem {
    constructor (componentRepository: ComponentRepository, gameEventDispatcher: GenericGameEventDispatcherSystem, notificationPort:NotificationPort) {
        super(componentRepository, gameEventDispatcher)
        this.notificationPort = notificationPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerEntityReference = this.componentRepository
            .retrieveEntityReferences(undefined)
            .filter((entityReference):entityReference is EntityReference => !!entityReference)
            .find(entityReference => entityReference.entityType.includes(EntityType.player))
        const message = this.entityByEntityType(gameEvent, EntityType.message)
        const eventPlayerId = this.entityByEntityType(gameEvent, EntityType.player)
        return this.notificationPort.notify(playerEntityReference && playerEntityReference.entityId === eventPlayerId
            ? message
            : wrongPlayerNotificationMessage(eventPlayerId, message)
        )
    }

    notificationPort: NotificationPort
}
