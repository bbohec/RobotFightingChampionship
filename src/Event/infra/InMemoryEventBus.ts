import { GameEvent } from '../GameEvent'
import { stringifyWithDetailledSetAndMap } from '../detailledStringify'
import { EventBus } from '../port/EventBus'
import { GameEventHandler } from '../GameEventHandler'
import { gameEventNotFoundOnEventInteractor } from '../../messages'

export class InMemoryEventBus extends GameEventHandler implements EventBus {
    public send (gameEvent: GameEvent): Promise<void> {
        this.events.push(gameEvent)
        return Promise.resolve()
    }

    public retrieveEvent (expectedEvent: GameEvent) {
        const gameEvents = this.events.filter(event => this.isEventsIdentical(event, expectedEvent))
        if (gameEvents.length > 0) return gameEvents
        throw new Error(gameEventNotFoundOnEventInteractor(expectedEvent, this.events, 'server'))
    }

    private isEventsIdentical (event: GameEvent, expectedEvent: GameEvent) {
        return (stringifyWithDetailledSetAndMap(event) === stringifyWithDetailledSetAndMap(expectedEvent))
    }

    public hasEvent (expectedEvent: GameEvent): boolean {
        return this.events.some(event => this.isEventsIdentical(event, expectedEvent))
    }

    public events: GameEvent[] = [];
}
