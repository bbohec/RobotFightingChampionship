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

    protected entityReferencesByEntityId (playerId: string) {
        return this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference)
    }

    abstract onGameEvent(gameEvent: GameEvent): Promise<void>;
    protected readonly interactWithEntities: EntityInteractor;
    private readonly gameEventDispatcher:GenericGameEventDispatcherSystem
}
