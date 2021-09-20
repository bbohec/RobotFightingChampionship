import { PotentialClass } from '../../../Entities/ports/PotentialClass'
import { systemAlreadyInRepository, SystemInteractor, systemNotFoundOnRepository } from '../port/SystemInteractor'
import { System } from '../port/System'

export class InMemorySystemRepository implements SystemInteractor {
    addSystem (system: System): void {
        if (this.systems.has(system.constructor.name)) throw new Error(systemAlreadyInRepository(system))
        this.systems.set(system.constructor.name, system)
    }

    retrieveSystemByClass<Class extends System> (potentialSystem: PotentialClass<Class>): Class {
        const system = this.systems.get(potentialSystem.name)
        if (!system) throw new Error(systemNotFoundOnRepository<Class>(potentialSystem))
        return system as Class
    }

    private systems:Map<string, System> = new Map([])
}
