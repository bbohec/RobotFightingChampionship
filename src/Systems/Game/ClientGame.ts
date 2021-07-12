import { GameEvent } from '../../Event/GameEvent'
import { DrawingSystem } from '../Drawing/DrawingSystem'
import { ClientGameEventDispatcherSystem } from '../GameEventDispatcher/ClientGameEventDispatcherSystem'
import { System } from '../Generic/port/System'
import { ClientLifeCycleSystem } from '../LifeCycle/ClientLifeCycleSystem'
import { ClientMatchSystem } from '../Match/ClientMatchSystem'
import { GenericGameSystem } from './GenericGame'
import { clientAdapters } from './port/clientAdapters'

export class ClientGameSystem extends GenericGameSystem {
    constructor (adapters: clientAdapters) {
        const clientEventDispatcherSystem = new ClientGameEventDispatcherSystem(adapters.systemInteractor, adapters.eventInteractor)
        const systems: Set<System> = new Set([])
        systems.add(clientEventDispatcherSystem)
        systems.add(new ClientLifeCycleSystem(adapters.entityInteractor, clientEventDispatcherSystem, adapters.identifierInteractor))
        systems.add(new DrawingSystem(adapters.entityInteractor, clientEventDispatcherSystem, adapters.drawingInteractor))
        systems.add(new ClientMatchSystem(adapters.entityInteractor, clientEventDispatcherSystem))
        super(adapters.systemInteractor, systems)
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.interactWithSystems.retrieveSystemByClass(ClientGameEventDispatcherSystem).onGameEvent(gameEvent)
    }
}
