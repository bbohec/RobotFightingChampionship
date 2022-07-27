import { SystemInteractor, systemAlreadyInRepository, SystemType, systemNotFoundOnRepository } from '../../core/port/SystemInteractor'
import { System } from '../../core/ecs/system'

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
