import { linkEntityToEntities, makeEntityReference } from '../components/EntityReference'
import { makePhysical, position } from '../components/Physical'
import { ShapeType } from '../../type/ShapeType'
import { EntityType } from '../../type/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { activatePointerEvent } from '../../events/activate/activate'
import { registerPlayerEvent } from '../../events/register/register'
import { Component } from '../component'
import { Identifier } from '../../port/Identifier'
import { GenericClientSystem, GenericGameEventDispatcherSystem } from '../system'
import { ComponentRepository } from '../../port/ComponentRepository'
import { EntityId } from '../entity'
import { makeLifeCycle } from '../components/LifeCycle'

abstract class GenericClientLifeCycleSystem extends GenericClientSystem {
    constructor (componentRepository: ComponentRepository, interactWithGameEventDispatcher:GenericGameEventDispatcherSystem, interactWithIdentifiers:Identifier) {
        super(componentRepository, interactWithGameEventDispatcher)
        this.interactWithIdentiers = interactWithIdentifiers
    }

    abstract onGameEvent (gameEvent: GameEvent): Promise<void>

    protected createEntity (entityId: EntityId, components?: Component[]): void {
        this.componentRepository.saveComponents([
            makeLifeCycle(entityId),
            ...components || []
        ])
    }

    protected sendNextEvents (nextEvent: GameEvent[]): Promise<void> {
        return Promise.all(nextEvent.map(event => this.sendOptionnalNextEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    protected sendOptionnalNextEvent (nextEvent?: GameEvent | GameEvent[]): Promise<void> {
        return (nextEvent === undefined)
            ? Promise.resolve()
            : (!Array.isArray(nextEvent))
                ? this.sendEvent(nextEvent)
                : this.sendNextEvents(nextEvent)
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
        this.createEntity(pointerId,
            [
                makeEntityReference(pointerId, EntityType.pointer),
                makePhysical(pointerId, position(0, 0), ShapeType.pointer, true)
            ]
        )
        linkEntityToEntities(this.componentRepository, pointerId, [this.entityByEntityType(gameEvent, EntityType.player)])
        return this.sendEvent(activatePointerEvent(pointerId))
    }

    private createPlayerEntity (playerId: string): Promise<void> {
        this.createEntity(playerId, [makeEntityReference(playerId, EntityType.player)])
        return this.sendEvent(registerPlayerEvent(playerId))
    }
}
