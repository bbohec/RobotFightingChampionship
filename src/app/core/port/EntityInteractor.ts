import { Controller } from '../ecs/components/Controller'
import { Dimensional } from '../ecs/components/Dimensional'
import { EntityReference } from '../ecs/components/EntityReference'
import { Hittable } from '../ecs/components/Hittable'
import { LifeCycle } from '../ecs/components/LifeCycle'
import { Offensive } from '../ecs/components/Offensive'
import { Phasing } from '../ecs/components/Phasing'
import { Physical } from '../ecs/components/Physical'
import { Component, ComponentType } from '../ecs/component'
import { EntityId, Entity } from '../ecs/entity/Entity'

export interface EntityInteractor {
    retrieveOffensive(offensiveEntityId: string): Offensive
    retrieveHittable(hittableEntityId: string):Hittable
    retrievePhysical(entityId: string): Physical
    retrieveLifeCycle(entityId: string):LifeCycle
    unlinkEntities(originEntityReference: EntityReference, targetEntityReference: EntityReference):void
    linkEntityToEntities(entityId: EntityId, entityIds: EntityId[]):void
    deleteEntity(entityId: EntityId):void
    hasEntity(entityId:EntityId):boolean
    retrieveEntitiesThatHaveComponent (componentType:ComponentType): Entity[];
    retreiveController(entityId:string):Controller
    retreiveDimensional(entityId:string):Dimensional
    retreiveEntityReference(entityId: string):EntityReference
    retreivePhasing(entityId: string):Phasing
    saveEntity(entity: Entity): void;
    saveComponent(component: Component): void;
}
