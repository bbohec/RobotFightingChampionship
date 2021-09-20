import { PotentialClass } from '../../../Entities/ports/PotentialClass'
import { System } from './System'

export interface SystemInteractor {
    addSystem(system: System):void
    retrieveSystemByClass<Class extends System>(potentialSystem: PotentialClass<Class>): Class;
}
export const systemNotFoundOnRepository = <Class extends System> (potentialSystem: PotentialClass<Class>): string =>
    `System '${potentialSystem.name}' not found on system repository.`
export const systemAlreadyInRepository = (system: System): string =>
    `System '${system.constructor.name}'already in repository.`
