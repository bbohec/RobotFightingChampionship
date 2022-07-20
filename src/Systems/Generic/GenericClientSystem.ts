import { GameEvent } from '../../Event/GameEvent'
import { System } from './port/System'
import { EntityInteractor } from '../../Entities/ports/EntityInteractor'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { EntityReference } from '../../Components/EntityReference'
import { GameEventHandler } from '../../Event/GameEventHandler'
export abstract class GenericClientSystem extends GameEventHandler implements System {
    constructor (
        protected readonly interactWithEntities: EntityInteractor,
        private readonly gameEventDispatcher:GenericGameEventDispatcherSystem
    ) { super() }

    public sendEvent (event:GameEvent):Promise<void> {
        return this.gameEventDispatcher.sendEventToClient(event)
    }

    public sendEvents (events:GameEvent[]):Promise<void> {
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    protected entityReferencesByEntityId (entityId: string) {
        return this.interactWithEntities.retrieveComponent<EntityReference>(entityId)
    }

    abstract onGameEvent(gameEvent: GameEvent): Promise<void>;
}
