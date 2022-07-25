import { GameEvent } from '../../Event/GameEvent'
import { EventBus } from '../../Event/port/EventBus'

export interface EventInteractor {
    sendEventToClient(gameEvent: GameEvent): Promise<void>
    sendEventToServer(gameEvent: GameEvent): Promise<void>
    eventBus:EventBus
    start():Promise<void>
    stop():Promise<void>
}

export interface ClientEventInteractor extends EventInteractor {
    clientId: string;
}
export interface ServerEventInteractor extends EventInteractor {
}
