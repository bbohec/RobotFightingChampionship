import { GameEvent } from '../../../Event/GameEvent'
import { stringifyWithDetailledSetAndMap } from '../../../Event/test'
import { EventInteractor } from '../port/EventInteractor'

export class InMemoryEventRepository implements EventInteractor {
    public sendEvent (gameEvent: GameEvent): Promise<void> {
        this.gameEvents.push(gameEvent)
        return Promise.resolve()
    }

    public retrieveEvent (expectedEvent: GameEvent): GameEvent[] {
        const gameEvent = this.gameEvents.filter(event => this.isEventsIdentical(event, expectedEvent))
        if (gameEvent.length > 0) return gameEvent
        throw new Error(`The following game event is not found on event repository:\n${stringifyWithDetailledSetAndMap(expectedEvent)}
        List of current events:\n${this.gameEvents.map(event => stringifyWithDetailledSetAndMap(event)).join('\n')}`)
    }

    private isEventsIdentical (event: GameEvent, expectedEvent: GameEvent) {
        return (stringifyWithDetailledSetAndMap(event) === stringifyWithDetailledSetAndMap(expectedEvent))
    }

    public hasEvent (expectedEvent: GameEvent): boolean {
        return this.gameEvents.some(event => this.isEventsIdentical(event, expectedEvent))
    }

    public gameEvents: GameEvent[] = []
}
