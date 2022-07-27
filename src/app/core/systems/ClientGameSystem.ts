import { ClientGameAdapters } from '../port/Game'
import { System } from '../system/System'
import { GameEvent } from '../type/GameEvent'
import { ClientGameEventDispatcherSystem } from './ClientGameEventDispatcherSystem'
import { ClientLifeCycleSystem } from './ClientLifeCycleSystem'
import { ControllerSystem } from './ControllerSystem'
import { DrawingSystem } from './DrawingSystem'
import { GenericGameSystem } from '../system/GenericGameSystem'
import { NotificationSystem } from './NotificationSystem'

export class ClientGameSystem extends GenericGameSystem {
    constructor (adapters: ClientGameAdapters) {
        const clientEventDispatcherSystem = new ClientGameEventDispatcherSystem(adapters.systemInteractor, adapters.eventInteractor)
        const systems: Set<System> = new Set([])
        systems.add(clientEventDispatcherSystem)
        systems.add(new ClientLifeCycleSystem(adapters.entityInteractor, clientEventDispatcherSystem, adapters.identifierInteractor))
        systems.add(new DrawingSystem(adapters.entityInteractor, clientEventDispatcherSystem, adapters.drawingInteractor))
        systems.add(new ControllerSystem(adapters.entityInteractor, clientEventDispatcherSystem, adapters.controllerAdapter))
        systems.add(new NotificationSystem(adapters.entityInteractor, clientEventDispatcherSystem, adapters.notificationInteractor))
        super(adapters.systemInteractor, systems)
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.interactWithSystems.retrieveSystemByClass(ClientGameEventDispatcherSystem).onGameEvent(gameEvent)
    }
}
