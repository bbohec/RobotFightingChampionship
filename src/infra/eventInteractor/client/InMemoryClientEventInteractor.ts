import { EventBus } from '../../../app/core/port/EventBus'
import { ClientEventInteractor, ServerEventInteractor } from '../../../app/core/port/EventInteractor'
import { GameEvent } from '../../../app/core/type/GameEvent'

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
