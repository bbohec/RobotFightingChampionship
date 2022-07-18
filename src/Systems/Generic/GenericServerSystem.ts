import { GameEvent } from '../../Event/GameEvent'
import { System } from './port/System'
import { EntityInteractor } from '../../Entities/ports/EntityInteractor'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { EntityReference } from '../../Components/EntityReference'
export abstract class GenericServerSystem implements System {
    constructor (interactWithEntities: EntityInteractor, gameEventDispatcher:GenericGameEventDispatcherSystem) {
        this.interactWithEntities = interactWithEntities
        this.gameEventDispatcher = gameEventDispatcher
    }

    public sendEvent (event:GameEvent):Promise<void> {
        return this.gameEventDispatcher.sendEventToServer(event)
    }

    public sendEvents (events:GameEvent[]):Promise<void> {
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    protected entityReferencesByEntityId (entityId: string):EntityReference {
        return this.interactWithEntities.retrieveyComponentByEntityId<EntityReference>(entityId)
    }

    abstract onGameEvent(gameEvent: GameEvent): Promise<void>;
    protected readonly interactWithEntities: EntityInteractor;
    private readonly gameEventDispatcher:GenericGameEventDispatcherSystem
}
