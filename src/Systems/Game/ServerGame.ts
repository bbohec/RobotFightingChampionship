
import { GameEvent } from '../../Event/GameEvent'
import { AttackingSystem } from '../Attacking/AttackingSystem'
import { CollisionSystem } from '../Collision/CollisionSystem'
import { ServerGameEventDispatcherSystem } from '../GameEventDispatcher/ServerGameEventDispatcherSystem'
import { System } from '../Generic/port/System'
import { HitSystem } from '../Hit/HitSystem'
import { ServerLifeCycleSystem } from '../LifeCycle/ServerLifeCycleSystem'
import { LoopSystem } from '../Loop/LoopSystem'
import { ServerMatchSystem } from '../Match/ServerMatchSystem'
import { MovingSystem } from '../Moving/MovingSystem'
import { PhasingSystem } from '../Phasing/PhasingSystem'
import { PlayerSystem } from '../Player/Player'
import { WaitingAreaSystem } from '../WaitingArea/WaitingAreaSystem'
import { GenericGameSystem } from './GenericGame'
import { serverAdapters } from './port/serverAdapters'

export class ServerGameSystem extends GenericGameSystem {
    constructor (adapters:serverAdapters) {
        const serverEventDispatcherSystem = new ServerGameEventDispatcherSystem(adapters.systemInteractor, adapters.eventInteractor)
        const systems: Set<System> = new Set([])
        systems.add(serverEventDispatcherSystem)
        systems.add(new ServerLifeCycleSystem(adapters.entityInteractor, serverEventDispatcherSystem, adapters.identifierInteractor))
        systems.add(new WaitingAreaSystem(adapters.entityInteractor, serverEventDispatcherSystem))
        systems.add(new ServerMatchSystem(adapters.entityInteractor, serverEventDispatcherSystem))
        systems.add(new PhasingSystem(adapters.entityInteractor, serverEventDispatcherSystem))
        systems.add(new HitSystem(adapters.entityInteractor, serverEventDispatcherSystem))
        systems.add(new AttackingSystem(adapters.entityInteractor, serverEventDispatcherSystem))
        systems.add(new MovingSystem(adapters.entityInteractor, serverEventDispatcherSystem))
        systems.add(new CollisionSystem(adapters.entityInteractor, serverEventDispatcherSystem))
        systems.add(new PlayerSystem(adapters.entityInteractor, serverEventDispatcherSystem))
        systems.add(new LoopSystem(adapters.entityInteractor, serverEventDispatcherSystem))
        super(adapters.systemInteractor, systems)
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.interactWithSystems.retrieveSystemByClass(ServerGameEventDispatcherSystem).onGameEvent(gameEvent)
    }
}
