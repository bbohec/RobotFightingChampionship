import { GameEvent } from '../../Event/GameEvent'
import { System } from '../Generic/port/System'
import { SystemInteractor } from '../Generic/port/SystemInteractor'
import { EventInteractor } from './port/EventInteractor'

export abstract class GenericGameEventDispatcherSystem implements System {
    constructor (systemInteractor:SystemInteractor, eventInteractor:EventInteractor) {
        this.interactWithSystems = systemInteractor
        this.interactWithEvents = eventInteractor
    }

    public sendEventToServer (gameEvent: GameEvent): Promise<void> {
        return this.interactWithEvents.sendEventToServer(gameEvent)
    }

    public sendEventToClient (gameEvent: GameEvent): Promise<void> {
        return this.interactWithEvents.sendEventToClient(gameEvent)
    }

    abstract onGameEvent (gameEvent:GameEvent):Promise<void>

    protected interactWithSystems: SystemInteractor
    private interactWithEvents:EventInteractor
}
