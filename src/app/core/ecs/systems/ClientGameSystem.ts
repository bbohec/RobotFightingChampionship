import { ClientGameAdapters } from '../../port/Game'
import { GenericGameSystem, System } from '../system'
import { GameEvent } from '../../type/GameEvent'
import { ClientGameEventDispatcherSystem } from './ClientGameEventDispatcherSystem'
import { ClientLifeCycleSystem } from './ClientLifeCycleSystem'
import { ControllerSystem } from './ControllerSystem'
import { DrawingSystem } from './DrawingSystem'
import { NotificationSystem } from './NotificationSystem'

export class ClientGameSystem extends GenericGameSystem {
    constructor (adapters: ClientGameAdapters) {
        const clientEventDispatcherSystem = new ClientGameEventDispatcherSystem(adapters.systemInteractor, adapters.eventInteractor)
        const systems: Set<System> = new Set([])
        systems.add(clientEventDispatcherSystem)
        systems.add(new ClientLifeCycleSystem(adapters.componentRepository, clientEventDispatcherSystem, adapters.identifierInteractor))
        systems.add(new DrawingSystem(adapters.componentRepository, clientEventDispatcherSystem, adapters.drawingInteractor))
        systems.add(new ControllerSystem(adapters.componentRepository, clientEventDispatcherSystem, adapters.controllerAdapter))
        systems.add(new NotificationSystem(adapters.componentRepository, clientEventDispatcherSystem, adapters.notificationInteractor))
        super(adapters.systemInteractor, systems)
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.interactWithSystems.retrieveSystemByClass(ClientGameEventDispatcherSystem).onGameEvent(gameEvent)
    }
}
