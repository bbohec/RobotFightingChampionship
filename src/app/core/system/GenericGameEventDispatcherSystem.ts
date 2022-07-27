import { GameEvent } from '../type/GameEvent'
import { GameEventHandler } from './GameEventHandler'
import { EventInteractor } from '../port/EventInteractor'
import { System } from './System'
import { SystemInteractor } from '../port/SystemInteractor'

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
