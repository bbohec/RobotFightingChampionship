import { Controller } from '../../core/components/Controller'
import { Dimensional } from '../../core/components/Dimensional'
import { EntityReference } from '../../core/components/EntityReference'
import { Hittable } from '../../core/components/Hittable'
import { LifeCycle } from '../../core/components/LifeCycle'
import { Offensive } from '../../core/components/Offensive'
import { Phasing } from '../../core/components/Phasing'
import { Physical } from '../../core/components/Physical'
import { ComponentType } from '../../core/component/ComponentType'
import { Component } from '../../core/component/Component'
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
