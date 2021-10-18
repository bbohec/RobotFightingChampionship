import { GameEvent } from '../../Event/GameEvent'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'
import { ClientEventInteractor, ServerEventInteractor } from '../port/EventInteractor'
import { EventBus } from '../../Event/port/EventBus'
import { ComponentBuilder } from '../../Components/port/ComponentBuilder'
import { ComponentSerializer } from '../../Components/port/ComponentSerializer'

export class InMemoryClientEventInteractor implements ClientEventInteractor {
    private serverEventInteractor: ServerEventInteractor | undefined;
    private componentBuilder = new ComponentBuilder();
    private componentSerializer = new ComponentSerializer();
    constructor (clientId: string, eventBus: EventBus) {
        this.clientId = clientId
        this.eventBus = eventBus
    }

    setServerEventInteractor (serverEventInteractor: ServerEventInteractor) {
        this.serverEventInteractor = serverEventInteractor
    }

    clientId: string;
    sendEventToServer (gameEvent: GameEvent | SerializedGameEvent): Promise<void> {
        if (this.serverEventInteractor && gameEvent instanceof GameEvent)
            return this.serverEventInteractor.eventBus.send(gameEvent);
        (gameEvent instanceof GameEvent)
            ? this.eventBus.send(gameEvent)
            : this.eventBus.send(new GameEvent({
                action: gameEvent.action,
                components: gameEvent.components.map(component => this.componentBuilder.buildComponent(component)),
                entityRefences: gameEvent.entityRefences
            }))
        return Promise.resolve()
    }

    sendEventToClient (gameEvent: GameEvent): Promise<void> {
        return this.eventBus.send(gameEvent)
    }

    eventBus: EventBus;
    start (): void {
    }

    stop (): void {
    }
}
