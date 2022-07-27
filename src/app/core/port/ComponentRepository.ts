import { Component, ComponentType } from '../ecs/component'
import { Controller } from '../ecs/components/Controller'
import { Dimensional } from '../ecs/components/Dimensional'
import { EntityReference } from '../ecs/components/EntityReference'
import { Hittable } from '../ecs/components/Hittable'
import { LifeCycle } from '../ecs/components/LifeCycle'
import { Offensive } from '../ecs/components/Offensive'
import { Phasing } from '../ecs/components/Phasing'
import { Physical } from '../ecs/components/Physical'
import { EntityId } from '../ecs/entity'

export interface ComponentRepository {
    retrievePhysicals(entityIds: EntityId[]|undefined): (Physical|undefined)[]
    retrieveEntityReferences(entityIds: EntityId[]|undefined): (EntityReference|undefined)[]
    retrieveOffensive(entityId: EntityId): Offensive
    retrieveHittable(entityId: EntityId):Hittable
    retrievePhysical(entityId: EntityId): Physical
    retrieveLifeCycle(entityId: EntityId):LifeCycle
    retrieveController(entityId:EntityId):Controller
    retrieveDimensional(entityId:EntityId):Dimensional
    retrieveEntityReference(entityId: EntityId):EntityReference
    retrievePhasing(entityId: EntityId):Phasing

    saveComponent(component: Component): void;
    saveComponents(components: Component[]):void
    deleteEntityComponents(entityId: EntityId):void
    entitiesWithType (componentType:ComponentType): EntityId[];
}
