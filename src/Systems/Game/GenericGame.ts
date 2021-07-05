import { GameEvent } from '../../Events/port/GameEvent'
import { System } from '../Generic/port/System'
import { SystemInteractor } from '../Generic/port/SystemInteractor'

export abstract class GenericGameSystem implements System {
    constructor (interactWithSystems:SystemInteractor, systems:Set<System>) {
        this.interactWithSystems = interactWithSystems
        systems.forEach(system => this.interactWithSystems.addSystem(system))
    }

    abstract onGameEvent (gameEvent: GameEvent): Promise<void>

    protected interactWithSystems: SystemInteractor
}
