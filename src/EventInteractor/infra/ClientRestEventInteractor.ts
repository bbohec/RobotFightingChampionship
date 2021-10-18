import { GameEvent } from '../../Event/GameEvent'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'
import { IntegrationEventInteractor } from '../port/IntegrationEventInteractor'

export class ClientRestEventInteractor implements IntegrationEventInteractor {
    serializeEvent (gameEvent: GameEvent): SerializedGameEvent {
        throw new Error('Method not implemented.')
    }

    clientGameEvents: GameEvent[] = [];
    serverGameEvents: GameEvent[] = [];
    setClientEventInteractor (clientEventInteractor: IntegrationEventInteractor): void {
        throw new Error('Method not implemented.')
    }

    setServerEventInteractor (serverEventInteractor: IntegrationEventInteractor): void {
        throw new Error('Method not implemented.')
    }

    sendEventToServer (gameEvent: GameEvent): Promise<void> {
        throw new Error('Method not implemented.')
    }

    sendEventToClient (gameEvent: GameEvent): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
