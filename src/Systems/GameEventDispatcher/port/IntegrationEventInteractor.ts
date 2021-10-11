import { GameEvent } from '../../../Event/GameEvent'
import { EventInteractor } from './EventInteractor'
import { SerializedGameEvent } from '../../../Event/SerializedGameEvent'

export interface IntegrationEventInteractor extends EventInteractor {
    clientGameEvents: GameEvent[];
    serverGameEvents: GameEvent[];
    serializeEvent(gameEvent: GameEvent): SerializedGameEvent;
    setClientEventInteractor(clientEventInteractor: IntegrationEventInteractor): void;
    setServerEventInteractor(serverEventInteractor: IntegrationEventInteractor): void;

}
