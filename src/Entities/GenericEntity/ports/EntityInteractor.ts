import { Component } from '../../../Components/port/Component'
import { GenericEntity } from '../GenericEntity'
import { PotentialClass } from './PotentialClass'
export interface EntityInteractor {
    deleteEntityById(entityId: string):void
    retrieveEntitiesThatHaveComponent<PotentialEntity extends GenericEntity, PotentialComponent extends Component> (potentialEntity: PotentialClass<PotentialEntity>, potentialComponent:PotentialClass<PotentialComponent>): PotentialEntity[];
    retrieveEntityById (entityId:string): GenericEntity;
    retrieveEntityByClass <Class extends GenericEntity> (potentialClass: PotentialClass<Class>, entityId?:string): Class;
    addEntity(entity: GenericEntity): void;
}
