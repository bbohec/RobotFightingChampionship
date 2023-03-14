import { ServerGameAdapters } from '../../port/Game'
import { GenericGameSystem, System } from '../system'
import { GameEvent } from '../../type/GameEvent'
import { AttackingSystem } from './AttackingSystem'
import { CollisionSystem } from './CollisionSystem'
import { HitSystem } from './HitSystem'
import { LoopSystem } from './LoopSystem'
import { MovingSystem } from './MovingSystem'
import { PhasingSystem } from './PhasingSystem'
import { PlayerSystem } from './PlayerSystem'
import { ServerGameEventDispatcherSystem } from './ServerGameEventDispatcherSystem'
import { ServerLifeCycleSystem } from './ServerLifeCycleSystem'
import { ServerMatchSystem } from './ServerMatchSystem'
import { WaitingAreaSystem } from './WaitingAreaSystem'

export class ServerGameSystem extends GenericGameSystem {
    constructor (adapters: ServerGameAdapters) {
        const serverEventDispatcherSystem = new ServerGameEventDispatcherSystem(adapters.systemInteractor, adapters.eventInteractor)
        const systems: Set<System> = new Set([])
        systems.add(serverEventDispatcherSystem)
        systems.add(new ServerLifeCycleSystem(adapters.componentRepository, serverEventDispatcherSystem, adapters.identifierInteractor))
        systems.add(new WaitingAreaSystem(adapters.componentRepository, serverEventDispatcherSystem))
        systems.add(new ServerMatchSystem(adapters.componentRepository, serverEventDispatcherSystem))
        systems.add(new PhasingSystem(adapters.componentRepository, serverEventDispatcherSystem))
        systems.add(new HitSystem(adapters.componentRepository, serverEventDispatcherSystem))
        systems.add(new AttackingSystem(adapters.componentRepository, serverEventDispatcherSystem))
        systems.add(new MovingSystem(adapters.componentRepository, serverEventDispatcherSystem))
        systems.add(new CollisionSystem(adapters.componentRepository, serverEventDispatcherSystem))
        systems.add(new PlayerSystem(adapters.componentRepository, serverEventDispatcherSystem))
        systems.add(new LoopSystem(adapters.componentRepository, serverEventDispatcherSystem))
        super(adapters.systemInteractor, systems)
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.interactWithSystems.retrieveSystemByClass(ServerGameEventDispatcherSystem).onGameEvent(gameEvent)
    }
}
