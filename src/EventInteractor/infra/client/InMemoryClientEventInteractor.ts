import { GameEvent } from '../../../Event/GameEvent'
import { ClientEventInteractor, ServerEventInteractor } from '../../port/EventInteractor'
import { EventBus } from '../../../Event/port/EventBus'

export class InMemoryClientEventInteractor implements ClientEventInteractor {
    public serverEventInteractor: ServerEventInteractor | undefined;
    // eslint-disable-next-line no-useless-constructor
    constructor (
        public clientId: string,
        public eventBus: EventBus
    ) {}

    setServerEventInteractor (serverEventInteractor: ServerEventInteractor) {
        this.serverEventInteractor = serverEventInteractor
    }

    sendEventToServer (gameEvent: GameEvent): Promise<void> {
        return (this.serverEventInteractor)
            ? this.serverEventInteractor.eventBus.send(gameEvent)
            : Promise.resolve()
    }

    sendEventToClient (gameEvent: GameEvent): Promise<void> {
        return this.eventBus.send(gameEvent)
    }

    start (): Promise<void> {
        return Promise.resolve()
    }

    stop (): Promise<void> {
        return Promise.resolve()
    }
}
