import { EntityReference } from '../../Components/EntityReference'
import { Component } from '../../Components/port/Component'
import { Entity } from '../Entity'
export interface EntityInteractor {
    unlinkEntities(originEntityReference: EntityReference, targetEntityReference: EntityReference):void
    linkEntityToEntities(entityId: string, entityIds: string[]):void
    deleteEntityById(entityId: string):void
    // eslint-disable-next-line no-unused-vars
    retrieveEntitiesThatHaveComponent<Type extends Component> (): Entity[];
    isEntityExist(entityId:string):boolean
    retrieveyComponentByEntityId <Type extends Component> (entityId:string):Type;
    saveEntity(entity: Entity): void;
}
