
import { systemAlreadyInRepository, SystemInteractor, systemNotFoundOnRepository } from '../port/SystemInteractor'
import { System } from '../port/System'

export class InMemorySystemRepository implements SystemInteractor {
    addSystem (system: System): void {
        if (this.systems.has(system.constructor.name)) throw new Error(systemAlreadyInRepository(system, this.systems))
        this.systems.set(system.constructor.name, system)
    }

    retrieveSystemByClass<Class extends System> (): Class {
        const system = this.systems.get(({} as Class).constructor.name)
        if (!system) throw new Error(systemNotFoundOnRepository<Class>())
        return system as Class
    }

    private systems:Map<string, System> = new Map([])
}
