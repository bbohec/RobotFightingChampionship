import { EntityReference } from '../../Components/EntityReference'
import { Component, ComponentType } from '../../Components/port/Component'
import { Entity, EntityId } from '../Entity'
export interface EntityInteractor {
    unlinkEntities(originEntityReference: EntityReference, targetEntityReference: EntityReference):void
    linkEntityToEntities(entityId: EntityId, entityIds: EntityId[]):void
    deleteEntity(entityId: EntityId):void
    retrieveEntitiesThatHaveComponent (componentType:ComponentType): Entity[];
    hasEntity(entityId:EntityId):boolean
    retrieveComponent <Type extends Component> (entityId:EntityId):Type;
    saveEntity(entity: Entity): void;
}
