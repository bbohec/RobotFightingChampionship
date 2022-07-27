import { GameEventHandler } from '../../core/ecs/system'
import { EventBus } from '../../core/port/EventBus'
import { GameEvent } from '../../core/type/GameEvent'
import { gameEventNotFoundOnEventInteractor, stringifyWithDetailledSetAndMap } from '../../messages'

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
