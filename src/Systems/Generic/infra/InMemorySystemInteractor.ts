
import { systemAlreadyInRepository, SystemInteractor, systemNotFoundOnRepository, SystemType } from '../port/SystemInteractor'
import { System } from '../port/System'

export class InMemorySystemRepository implements SystemInteractor {
    addSystem (system: System): void {
        if (this.systems.has(system.constructor.name)) throw new Error(systemAlreadyInRepository(system, this.systems))
        this.systems.set(system.constructor.name, system)
    }

    retrieveSystemByClass<T extends System> (potentialSystem: SystemType<T>): T {
        const system = this.systems.get(potentialSystem.name)
        if (!system) throw new Error(systemNotFoundOnRepository<T>())
        return system as T
    }

    private systems:Map<string, System> = new Map([])
}
