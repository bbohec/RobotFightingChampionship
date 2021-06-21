import { GameEvent } from '../../Events/port/GameEvent'
import { GenericSystem } from '../Generic/GenericSystem'

export abstract class GenericGameEventDispatcherSystem extends GenericSystem {
    public hasEvent (expectedEvent: GameEvent): boolean {
        const isEventsIdentical = (event:GameEvent, expectedEvent:GameEvent) => (
            event.destination === expectedEvent.destination &&
            event.message === expectedEvent.message &&
            event.destinationId === expectedEvent.destinationId &&
            event.sourceRef === expectedEvent.sourceRef
        )
        return this.gameEvents.some(event => isEventsIdentical(event, expectedEvent))
    }

    public sendEvent (gameEvent: GameEvent): Promise<void> {
        this.gameEvents.push(gameEvent)
        return Promise.resolve()
    }

    abstract onGameEvent (gameEvent:GameEvent):Promise<void>

    public gameEvents: GameEvent[] = []
}
