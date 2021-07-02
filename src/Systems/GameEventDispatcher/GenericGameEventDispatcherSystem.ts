import { GameEvent } from '../../Events/port/GameEvent'
import { System } from '../Generic/port/System'
import { SystemInteractor } from '../Generic/port/SystemInteractor'

export abstract class GenericGameEventDispatcherSystem implements System {
    constructor (systemInteractor:SystemInteractor) {
        this.interactWithSystems = systemInteractor
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

    public sendEvent (gameEvent: GameEvent): Promise<void> {
        this.gameEvents.push(gameEvent)
        return Promise.resolve()
    }

    abstract onGameEvent (gameEvent:GameEvent):Promise<void>

    public gameEvents: GameEvent[] = []
    protected interactWithSystems: SystemInteractor
}
