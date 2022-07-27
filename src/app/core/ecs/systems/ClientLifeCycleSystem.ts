import { makeEntityReference } from '../components/EntityReference'
import { makePhysical, position } from '../components/Physical'
import { ShapeType } from '../../type/ShapeType'
import { Entity } from '../entity/Entity'
import { EntityType } from '../../type/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { activatePointerEvent } from '../../events/activate/activate'
import { registerPlayerEvent } from '../../events/register/register'
import { Component } from '../component'
import { makeLifeCycle } from '../components/LifeCycle'
import { Identifier } from '../../port/Identifier'
import { EntityInteractor } from '../../port/EntityInteractor'
import { GenericClientSystem, GenericGameEventDispatcherSystem } from '../system'

abstract class GenericClientLifeCycleSystem extends GenericClientSystem {
    constructor (interactWithEntities: EntityInteractor, interactWithGameEventDispatcher:GenericGameEventDispatcherSystem, interactWithIdentifiers:Identifier) {
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

    protected readonly interactWithIdentiers:Identifier
}

export class ClientLifeCycleSystem extends GenericClientLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.player) && this.hasEntitiesByEntityType(gameEvent, EntityType.pointer)
            ? this.createPointerEntity(gameEvent)
            : this.hasEntitiesByEntityType(gameEvent, EntityType.player)
                ? this.createPlayerEntity(this.interactWithIdentiers.nextIdentifier())
                : Promise.reject(new Error(errorMessageOnUnknownEventAction(ClientLifeCycleSystem.name, gameEvent)))
    }

    private createPointerEntity (gameEvent: GameEvent): Promise<void> {
        const pointerId = this.entityByEntityType(gameEvent, EntityType.pointer)
        this.createEntity(
            new Entity(pointerId),
            [
                makeEntityReference(pointerId, EntityType.pointer),
                makePhysical(pointerId, position(0, 0), ShapeType.pointer, true)
            ]
        )
        this.interactWithEntities.linkEntityToEntities(pointerId, [this.entityByEntityType(gameEvent, EntityType.player)])
        return this.sendEvent(activatePointerEvent(pointerId))
    }

    private createPlayerEntity (playerId: string): Promise<void> {
        this.createEntity(new Entity(playerId), [makeEntityReference(playerId, EntityType.player)])
        return this.sendEvent(registerPlayerEvent(playerId))
    }
}
