import { noEntitiesReferenced, multipleEntityReferenced, noEntityReferenced } from '../../messages'
import { EntityInteractor } from '../port/EntityInteractor'
import { EventInteractor } from '../port/EventInteractor'
import { SystemInteractor } from '../port/SystemInteractor'
import { EntityType } from '../type/EntityType'
import { GameEvent } from '../type/GameEvent'
import { ComponentType, Component } from './component'
import { Controller, toController } from './components/Controller'
import { Dimensional, toDimensional } from './components/Dimensional'
import { LifeCycle, toLifeCycle } from './components/LifeCycle'
import { Position, Physical, toPhysical } from './components/Physical'

export interface System {
    onGameEvent(gameEvent:GameEvent):Promise<void>
}

export abstract class GameEventHandler {
    retrievePhysical (event:GameEvent, entityId:string):Physical {
        const physical = event.components.find(component => component.componentType === 'Physical' && component.entityId === entityId)
        if (!physical) throw new Error('No physical component found for entityId: ' + entityId)
        return toPhysical(physical)
    }

    retrieveController (event:GameEvent, entityId:string):Controller {
        return this.retreiveComponent(event, entityId, 'Controller', toController)
    }

    private retreiveComponent <T> (event:GameEvent, entityId:string, componentType:ComponentType, validator: (component:Component)=> T):T {
        const component = event.components.find(component => component.componentType === componentType && component.entityId === entityId)
        if (!component) throw new Error(`No ${componentType} component found for entityId ${entityId}`)
        return validator(component)
    }

    retrieveDimensional (event:GameEvent, entityId:string):Dimensional {
        const physical = event.components.find(component => component.componentType === 'Dimensional' && component.entityId === entityId)
        if (!physical) throw new Error('No Dimensional component found for entityId: ' + entityId)
        return toDimensional(physical)
    }

    retrieveLifeCycle (event: GameEvent, entityId: string): LifeCycle {
        const lifeCycle = event.components.find(component => component.componentType === 'LifeCycle' && component.entityId === entityId)
        if (!lifeCycle) throw new Error('No physical component found for entityId: ' + entityId)
        return toLifeCycle(lifeCycle)
    }

    entitiesByEntityType (event:GameEvent, entityType:EntityType) {
        const entities = event.entityRefences.get(entityType)
        if (!entities) throw new Error(noEntitiesReferenced(entityType, event.action, event.entityRefences))
        return entities
    }

    action (entityType: EntityType, action: any, entityRefences: any): string | undefined {
        throw new Error('Method not implemented.')
    }

    entityByEntityType (event:GameEvent, entityType:EntityType) {
        const entities = this.entitiesByEntityType(event, entityType)
        if (entities.length > 1) throw new Error(multipleEntityReferenced(entityType))
        if (entities.length === 0) throw new Error(noEntityReferenced(entityType))
        return Array.from(entities)[0]
    }

    hasEntitiesByEntityType (event:GameEvent, entityType:EntityType):boolean {
        const entities = event.entityRefences.get(entityType)
        return !(!entities)
    }

    allEntityTypes (event:GameEvent):EntityType[] {
        return Array.from(event.entityRefences.keys())
    }

    allEntities (event:GameEvent) {
        const union = (...sets:string[][]) => sets.reduce((combined, list) => [...combined, ...list], [])
        return union(...event.entityRefences.values())
    }
}

export abstract class GenericServerSystem extends GameEventHandler implements System {
    constructor (
        protected readonly interactWithEntities: EntityInteractor,
        private readonly gameEventDispatcher:GenericGameEventDispatcherSystem
    ) { super() }

    public sendEvent (event:GameEvent):Promise<void> {
        return this.gameEventDispatcher.sendEventToServer(event)
    }

    public sendEvents (events:GameEvent[]):Promise<void> {
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    protected entityReferencesByEntityId (entityId: string) {
        return this.interactWithEntities.retreiveEntityReference(entityId)
    }

    abstract onGameEvent(gameEvent: GameEvent): Promise<void>;
}

export abstract class ArtithmeticSystem extends GenericServerSystem {
    protected pythagoreHypotenuse (position:Position):number {
        return Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2))
    }
}

export abstract class GenericClientSystem extends GameEventHandler implements System {
    constructor (
        protected readonly interactWithEntities: EntityInteractor,
        private readonly gameEventDispatcher:GenericGameEventDispatcherSystem
    ) { super() }

    public sendEvent (event:GameEvent):Promise<void> {
        return this.gameEventDispatcher.sendEventToClient(event)
    }

    public sendEvents (events:GameEvent[]):Promise<void> {
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    protected entityReferencesByEntityId (entityId: string) {
        return this.interactWithEntities.retreiveEntityReference(entityId)
    }

    abstract onGameEvent(gameEvent: GameEvent): Promise<void>;
}
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

export abstract class GenericGameSystem implements System {
    constructor (interactWithSystems: SystemInteractor, systems: Set<System>) {
        this.interactWithSystems = interactWithSystems
        systems.forEach(system => this.interactWithSystems.addSystem(system))
    }

    abstract onGameEvent(gameEvent: GameEvent): Promise<void>;

    protected interactWithSystems: SystemInteractor;
}
