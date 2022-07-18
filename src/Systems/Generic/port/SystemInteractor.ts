
import { System } from './System'

export interface SystemInteractor {
    addSystem(system: System):void
    retrieveSystemByClass<Class extends System>(): Class;
}
export const systemNotFoundOnRepository = <Class extends System> (): string =>
    `System '${({ }as Class).constructor.name}' not found on system repository.`
export const systemAlreadyInRepository = (system: System, systems:Map<string, System>): string =>
    `System '${system.constructor.name}'already in repository.
    List of current systems: ${[...systems.keys()]}`
