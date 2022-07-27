import { SystemInteractor } from '../port/SystemInteractor'
import { System } from './System'
import { GameEvent } from '../type/GameEvent'

export abstract class GenericGameSystem implements System {
    constructor (interactWithSystems: SystemInteractor, systems: Set<System>) {
        this.interactWithSystems = interactWithSystems
        systems.forEach(system => this.interactWithSystems.addSystem(system))
    }

    abstract onGameEvent(gameEvent: GameEvent): Promise<void>;

    protected interactWithSystems: SystemInteractor;
}
