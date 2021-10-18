import { GameEvent } from '../../Event/GameEvent'
import { stringifyWithDetailledSetAndMap } from '../../Event/test'
import { gameEventNotFoundOnEventRepository } from '../port/EventInteractor'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'
import { IntegrationEventInteractor } from '../port/IntegrationEventInteractor'
import { ComponentBuilder } from '../../Components/port/ComponentBuilder'
import { ComponentSerializer } from '../../Components/port/ComponentSerializer'

export class InMemoryEventRepository implements IntegrationEventInteractor {
    public retrieveServerEvent (expectedEvent: GameEvent) {
        const gameEvents = this.serverGameEvents.filter(event => this.isEventsIdentical(event, expectedEvent))
        if (gameEvents.length > 0) return gameEvents
        throw new Error(gameEventNotFoundOnEventRepository(expectedEvent, this.serverGameEvents, 'server'))
    }

    public retrieveClientEvent (expectedEvent: GameEvent) {
        const gameEvents = this.clientGameEvents.filter(event => this.isEventsIdentical(event, expectedEvent))
        if (gameEvents.length > 0) return gameEvents
        throw new Error(gameEventNotFoundOnEventRepository(expectedEvent, this.clientGameEvents, 'client'))
    }

    public sendEventToClient (gameEvent: GameEvent |SerializedGameEvent): Promise<void> {
        if (this.clientEventInteractor && gameEvent instanceof GameEvent) return this.clientEventInteractor.sendEventToClient(this.serializeEvent(gameEvent));
        (gameEvent instanceof GameEvent)
            ? this.clientGameEvents.push(gameEvent)
            : this.clientGameEvents.push(new GameEvent({
                action: gameEvent.action,
                components: gameEvent.components.map(component => this.componentBuilder.buildComponent(component)),
                entityRefences: gameEvent.entityRefences
            }))
        return Promise.resolve()
    }

    public sendEventToServer (gameEvent: GameEvent |SerializedGameEvent): Promise<void> {
        if (this.serverEventInteractor && gameEvent instanceof GameEvent) return this.serverEventInteractor.sendEventToServer(this.serializeEvent(gameEvent));
        (gameEvent instanceof GameEvent)
            ? this.serverGameEvents.push(gameEvent)
            : this.serverGameEvents.push(new GameEvent({
                action: gameEvent.action,
                components: gameEvent.components.map(component => this.componentBuilder.buildComponent(component)),
                entityRefences: gameEvent.entityRefences
            }))
        return Promise.resolve()
    }

    private isEventsIdentical (event: GameEvent, expectedEvent: GameEvent) {
        return (stringifyWithDetailledSetAndMap(event) === stringifyWithDetailledSetAndMap(expectedEvent))
    }

    public hasClientEvent (expectedEvent: GameEvent): boolean {
        return this.clientGameEvents.some(event => this.isEventsIdentical(event, expectedEvent))
    }

    public hasServerEvent (expectedEvent: GameEvent): boolean {
        return this.serverGameEvents.some(event => this.isEventsIdentical(event, expectedEvent))
    }

    serializeEvent (gameEvent: GameEvent): SerializedGameEvent {
        return {
            action: gameEvent.action,
            entityRefences: gameEvent.entityRefences,
            components: gameEvent.components.map(component => this.componentSerializer.serializeComponent(component))
        }
    }

    setClientEventInteractor (clientEventInteractor: IntegrationEventInteractor) {
        this.clientEventInteractor = clientEventInteractor
    }

    setServerEventInteractor (serverEventInteractor: IntegrationEventInteractor) {
        this.serverEventInteractor = serverEventInteractor
    }

    public serverGameEvents: GameEvent[] = []
    public clientGameEvents: GameEvent[] = []
    private serverEventInteractor: IntegrationEventInteractor | undefined
    private clientEventInteractor: IntegrationEventInteractor | undefined
    private componentBuilder = new ComponentBuilder()
    private componentSerializer = new ComponentSerializer()
}
