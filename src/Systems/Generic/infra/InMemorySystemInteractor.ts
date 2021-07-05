import { PotentialClass } from '../../../Entities/GenericEntity/ports/PotentialClass'
import { SystemInteractor } from '../port/SystemInteractor'
import { System } from '../port/System'

export class InMemorySystemRepository implements SystemInteractor {
    addSystem (system: System): void {
        if (this.systems.has(system.constructor.name)) throw new Error(`System '${system.constructor.name}'already in repository.`)
        this.systems.set(system.constructor.name, system)
    }

    retrieveSystemByClass<Class extends System> (potentialSystem: PotentialClass<Class>): Class {
        const system = this.systems.get(potentialSystem.name)
        if (!system) throw new Error(`System '${potentialSystem.name}' not found on system repository.`)
        return system as Class
    }

    private systems:Map<string, System> = new Map([])
}
