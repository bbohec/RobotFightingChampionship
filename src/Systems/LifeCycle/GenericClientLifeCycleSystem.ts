import { makeLifeCycle } from '../../core/components/LifeCycle'
import { Component } from '../../core/component/Component'
import { Entity } from '../../Entities/Entity'
import { EntityInteractor } from '../../Entities/ports/EntityInteractor'
import { GameEvent } from '../../core/type/GameEvent'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { GenericClientSystem } from '../Generic/GenericClientSystem'
import { IdentifierAdapter } from './port/IdentifierAdapter'

export abstract class GenericClientLifeCycleSystem extends GenericClientSystem {
    constructor (interactWithEntities: EntityInteractor, interactWithGameEventDispatcher:GenericGameEventDispatcherSystem, interactWithIdentifiers:IdentifierAdapter) {
        super(interactWithEntities, interactWithGameEventDispatcher)
        this.interactWithIdentiers = interactWithIdentifiers
    }

    abstract onGameEvent (gameEvent: GameEvent): Promise<void>

    protected createEntity (entity: Entity, components?: Component[]): void {
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
        entity.saveComponent(makeLifeCycle(entity.id, true))
    }

    protected sendOptionnalNextEvent (nextEvent?: GameEvent | GameEvent[]): Promise<void> {
        return (nextEvent === undefined)
            ? Promise.resolve()
            : (!Array.isArray(nextEvent))
                ? this.sendEvent(nextEvent)
                : this.sendNextEvents(nextEvent)
    }

    private addOptionnalComponents (components: Component[] | undefined, entity: Entity) {
        if (components) for (const component of components) entity.saveComponent(component)
    }

    protected readonly interactWithIdentiers:IdentifierAdapter
}
