import { GameEvent } from '../../Event/GameEvent'
import { GameEventHandler } from '../../Event/GameEventHandler'
import { EventInteractor } from '../../EventInteractor/port/EventInteractor'
import { System } from '../Generic/port/System'
import { SystemInteractor } from '../Generic/port/SystemInteractor'

export abstract class GenericGameEventDispatcherSystem extends GameEventHandler implements System {
    constructor (
        protected interactWithSystems: SystemInteractor,
        private interactWithEvents:EventInteractor
    ) { super() }

    public sendEventToServer (gameEvent: GameEvent): Promise<void> {
        return this.interactWithEvents.sendEventToServer(gameEvent)
    }

    public sendEventToClient (gameEvent: GameEvent): Promise<void> {
        return this.interactWithEvents.sendEventToClient(gameEvent)
    }

    abstract onGameEvent (gameEvent:GameEvent):Promise<void>
}
