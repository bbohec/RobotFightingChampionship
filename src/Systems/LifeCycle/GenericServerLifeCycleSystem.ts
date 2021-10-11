import { LifeCycle } from '../../Components/LifeCycle'
import { Entity } from '../../Entities/Entity'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { GenericComponent } from '../../Components/GenericComponent'
import { EntityInteractor } from '../../Entities/ports/EntityInteractor'
import { IdentifierAdapter } from './port/IdentifierAdapter'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { Action } from '../../Event/Action'
import { GameEvent } from '../../Event/GameEvent'
export const action = Action.create
export abstract class GenericServerLifeCycleSystem extends GenericServerSystem {
    constructor (interactWithEntities: EntityInteractor, interactWithGameEventDispatcher:GenericGameEventDispatcherSystem, interactWithIdentifiers:IdentifierAdapter) {
        super(interactWithEntities, interactWithGameEventDispatcher)
        this.interactWithIdentiers = interactWithIdentifiers
    }

    abstract onGameEvent (gameEvent: GameEvent): Promise<void>

    protected createEntity (entity: Entity, components?: GenericComponent[]): void {
        this.interactWithEntities.saveEntity(entity)
        this.addLifeCycleComponent(entity)
        this.addOptionnalComponents(components, entity)
    }

    protected sendNextEvents (nextEvent: GameEvent[]): Promise<void> {
        return Promise.all(nextEvent.map(event => this.sendOptionnalNextEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private addLifeCycleComponent (entity: Entity) {
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

    private addOptionnalComponents (components: GenericComponent[] | undefined, entity: Entity) {
        if (components) for (const component of components) entity.addComponent(component)
    }

    protected readonly interactWithIdentiers:IdentifierAdapter
}
