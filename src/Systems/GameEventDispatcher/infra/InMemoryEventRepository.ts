import { GameEvent } from '../../../Event/GameEvent'
import { stringifyWithDetailledSetAndMap } from '../../../Event/test'
import { EventInteractor, gameEventNotFoundOnEventRepository } from '../port/EventInteractor'

export class InMemoryEventRepository implements EventInteractor {
    public sendEvent (gameEvent: GameEvent): Promise<void> {
        this.gameEvents.push(gameEvent)
        return Promise.resolve()
    }

    public retrieveEvent (expectedEvent: GameEvent): GameEvent[] {
        const gameEvents = this.gameEvents.filter(event => this.isEventsIdentical(event, expectedEvent))
        if (gameEvents.length > 0) return gameEvents
        throw new Error(gameEventNotFoundOnEventRepository(expectedEvent, this.gameEvents))
    }

    private isEventsIdentical (event: GameEvent, expectedEvent: GameEvent) {
        return (stringifyWithDetailledSetAndMap(event) === stringifyWithDetailledSetAndMap(expectedEvent))
    }

    public hasEvent (expectedEvent: GameEvent): boolean {
        return this.gameEvents.some(event => this.isEventsIdentical(event, expectedEvent))
    }

    public gameEvents: GameEvent[] = []
}
