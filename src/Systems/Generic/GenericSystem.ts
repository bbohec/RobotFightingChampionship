import { GameEvent } from '../../Events/port/GameEvent'
import { SystemInteractor } from './port/SystemInteractor'
import { System } from './port/System'
import { EntityInteractor } from '../../Entities/GenericEntity/ports/EntityInteractor'
export abstract class GenericSystem implements System {
    constructor (interactWithEntities: EntityInteractor, interactWithSystems:SystemInteractor) {
        this.interactWithEntities = interactWithEntities
        this.interactWithSystems = interactWithSystems
    }

    abstract onGameEvent(gameEvent: GameEvent): Promise<void>;
    protected readonly interactWithEntities: EntityInteractor;
    protected readonly interactWithSystems:SystemInteractor
}
