import { LifeCycle } from '../../Components/LifeCycle'
import { GenericEntity } from '../../Entities/GenericEntity/GenericEntity'
import { GenericSystem } from '../Generic/GenericSystem'
import { GenericComponent } from '../../Components/GenericComponent'
import { EntityInteractor } from '../../Entities/GenericEntity/ports/EntityInteractor'
import { IdentifierAdapter } from './port/IdentifierAdapter'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { Action } from '../../Event/Action'
import { GameEvent } from '../../Event/GameEvent'
export const action = Action.create
export abstract class GenericLifeCycleSystem extends GenericSystem {
    constructor (interactWithEntities: EntityInteractor, interactWithGameEventDispatcher:GenericGameEventDispatcherSystem, interactWithIdentifiers:IdentifierAdapter) {
        super(interactWithEntities, interactWithGameEventDispatcher)
        this.interactWithIdentiers = interactWithIdentifiers
    }

    abstract onGameEvent (gameEvent: GameEvent): Promise<void>

    protected createEntity (entity: GenericEntity, components?: GenericComponent[], nextEvent?: GameEvent|GameEvent[]): Promise<void> {
        this.interactWithEntities.addEntity(entity)
        this.addLifeCycleComponent(entity)
        this.addOptionnalComponents(components, entity)
        return this.sendOptionnalNextEvent(nextEvent)
    }

    protected sendNextEvents (nextEvent: GameEvent[]): Promise<void> {
        return Promise.all(nextEvent.map(event => this.sendOptionnalNextEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private addLifeCycleComponent (entity: GenericEntity) {
        entity.addComponent(new LifeCycle(entity.id))
        entity.retrieveComponent(LifeCycle).isCreated = true
    }

    protected sendOptionnalNextEvent (nextEvent?: GameEvent | GameEvent[]): Promise<void> {
        return (nextEvent === undefined)
            ? Promise.resolve()
            : (!Array.isArray(nextEvent))
                ? this.sendEvent(nextEvent)
                : this.sendNextEvents(nextEvent)
    }

    private addOptionnalComponents (components: GenericComponent[] | undefined, entity: GenericEntity) {
        if (components) for (const component of components) entity.addComponent(component)
    }

    protected readonly interactWithIdentiers:IdentifierAdapter
}
