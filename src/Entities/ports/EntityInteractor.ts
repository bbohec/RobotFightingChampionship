import { Component } from '../../Components/port/Component'
import { Entity } from '../Entity'
import { PotentialClass } from './PotentialClass'
export interface EntityInteractor {
    linkEntityToEntities(entityId: string, entityIds: string[]):void
    deleteEntityById(entityId: string):void
    retrieveEntitiesThatHaveComponent<PotentialComponent extends Component> (potentialComponent:PotentialClass<PotentialComponent>): Entity[];
    // retrieveEntityById (entityId:string): Entity;
    retrieveEntityComponentByEntityId <Class extends Component> (entityId:string, potentialComponent: PotentialClass<Class>):Class;
    saveEntity(entity: Entity): void;
}
