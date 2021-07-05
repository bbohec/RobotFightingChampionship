import { GameEvent } from '../../../Events/port/GameEvent'
import { EventInteractor } from '../port/EventInteractor'

export class InMemoryEventRepository implements EventInteractor {
    public sendEvent (gameEvent: GameEvent): Promise<void> {
        this.gameEvents.push(gameEvent)
        return Promise.resolve()
    }

    public hasEvent (expectedEvent: GameEvent): boolean {
        const isEventsIdentical = (event:GameEvent, expectedEvent:GameEvent) => (
            event.targetEntityType === expectedEvent.targetEntityType &&
            event.action === expectedEvent.action &&
            event.targetEntityId === expectedEvent.targetEntityId &&
            event.originEntityId === expectedEvent.originEntityId
        )
        return this.gameEvents.some(event => isEventsIdentical(event, expectedEvent))
    }

    public gameEvents: GameEvent[] = []
}
