import { Controller } from '../../Components/Controller'
import { Dimensional } from '../../Components/Dimensional'
import { EntityReference } from '../../Components/EntityReference'
import { Hittable } from '../../Components/Hittable'
import { LifeCycle } from '../../Components/LifeCycle'
import { Offensive } from '../../Components/Offensive'
import { Phasing } from '../../Components/Phasing'
import { Physical } from '../../Components/Physical'
import { Component, ComponentType } from '../../Components/port/Component'
import { Entity, EntityId } from '../Entity'
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
