import { GameEvent } from '../../../Events/port/GameEvent'
import { EventInteractor } from '../port/EventInteractor'

export class InMemoryEventRepository implements EventInteractor {
    public sendEvent (gameEvent: GameEvent): Promise<void> {
        this.gameEvents.push(gameEvent)
        return Promise.resolve()
    }

    public retrieveEvent (expectedEvent: GameEvent): GameEvent[] {
        const isEventsIdentical = (event:GameEvent, expectedEvent:GameEvent) => (
            event.action === expectedEvent.action &&
            event.targetEntityType === expectedEvent.targetEntityType &&
            event.originEntityType === expectedEvent.originEntityType &&
            event.targetEntityId === expectedEvent.targetEntityId &&
            event.originEntityId === expectedEvent.originEntityId
        )
        const gameEvent = this.gameEvents.filter(event => isEventsIdentical(event, expectedEvent))
        if (gameEvent.length > 0) return gameEvent
        throw new Error(`The following game event is not found on event repository:\n${JSON.stringify(expectedEvent)}
        List of current events:\n${this.gameEvents.map(event => JSON.stringify(event)).join('\n')}`)
    }

    public hasEvent (expectedEvent: GameEvent): boolean {
        const isEventsIdentical = (event:GameEvent, expectedEvent:GameEvent) => (
            event.action === expectedEvent.action &&
            event.targetEntityType === expectedEvent.targetEntityType &&
            event.originEntityType === expectedEvent.originEntityType &&
            event.targetEntityId === expectedEvent.targetEntityId &&
            event.originEntityId === expectedEvent.originEntityId
        )
        return this.gameEvents.some(event => isEventsIdentical(event, expectedEvent))
    }

    public gameEvents: GameEvent[] = []
}
