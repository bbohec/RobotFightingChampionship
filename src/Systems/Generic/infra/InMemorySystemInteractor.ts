import { PotentialClass } from '../../../Entities/GenericEntity/ports/PotentialClass'
import { SystemInteractor } from '../port/SystemInteractor'
import { System } from '../port/System'

export class InMemorySystemRepository implements SystemInteractor {
    addSystem (system: System): void {
        this.systems.add(system)
    }

    retrieveSystemByClass<Class extends System> (potentialSystem: PotentialClass<Class>): Class {
        for (const system of this.systems.values()) if (system instanceof potentialSystem) return system as Class
        throw new Error(`System ${potentialSystem.name} not found on system repository.`)
    }

    public systems:Set<System> = new Set([])
}
