import { GameEvent } from '../../Events/port/GameEvent'
import { GenericSystem } from '../Generic/GenericSystem'

export abstract class GenericGameEventDispatcherSystem extends GenericSystem {
    public hasEvent (expectedEvent: GameEvent): boolean {
        const isEventsIdentical = (event:GameEvent, expectedEvent:GameEvent) => (
            event.targetEntityType === expectedEvent.targetEntityType &&
            event.action === expectedEvent.action &&
            event.targetEntityId === expectedEvent.targetEntityId &&
            event.originEntityId === expectedEvent.originEntityId
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
