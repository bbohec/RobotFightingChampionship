import { EntityInteractor } from '../../core/port/EntityInteractor'
import { GameEvent } from '../type/GameEvent'
import { GameEventHandler } from './GameEventHandler'
import { GenericGameEventDispatcherSystem } from './GenericGameEventDispatcherSystem'
import { System } from './System'

export abstract class GenericServerSystem extends GameEventHandler implements System {
    constructor (
        protected readonly interactWithEntities: EntityInteractor,
        private readonly gameEventDispatcher:GenericGameEventDispatcherSystem
    ) { super() }

    public sendEvent (event:GameEvent):Promise<void> {
        return this.gameEventDispatcher.sendEventToServer(event)
    }

    public sendEvents (events:GameEvent[]):Promise<void> {
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    protected entityReferencesByEntityId (entityId: string) {
        return this.interactWithEntities.retreiveEntityReference(entityId)
    }

    abstract onGameEvent(gameEvent: GameEvent): Promise<void>;
}
