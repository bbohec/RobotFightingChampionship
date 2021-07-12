import { GameEvent } from '../../Event/GameEvent'
import { System } from '../Generic/port/System'
import { SystemInteractor } from '../Generic/port/SystemInteractor'
import { EventInteractor } from './port/EventInteractor'

export abstract class GenericGameEventDispatcherSystem implements System {
    constructor (systemInteractor:SystemInteractor, eventInteractor:EventInteractor) {
        this.interactWithSystems = systemInteractor
        this.interactWithEvents = eventInteractor
    }

    public sendEvent (gameEvent: GameEvent): Promise<void> {
        return this.interactWithEvents.sendEvent(gameEvent)
    }

    abstract onGameEvent (gameEvent:GameEvent):Promise<void>

    protected interactWithSystems: SystemInteractor
    private interactWithEvents:EventInteractor
}
