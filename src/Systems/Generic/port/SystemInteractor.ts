import { PotentialClass } from '../../../Entities/GenericEntity/ports/PotentialClass'
import { System } from './System'

export interface SystemInteractor {
    addSystem(system: System):void
    retrieveSystemByClass<Class extends System>(potentialSystem: PotentialClass<Class>): Class;
}
