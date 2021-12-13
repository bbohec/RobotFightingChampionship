import { GameEvent } from '../../Event/GameEvent'
import { stringifyWithDetailledSetAndMap } from '../../Event/detailledStringify'
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

export const gameEventNotFoundOnEventInteractor = (expectedEvent: GameEvent, existingEvents: GameEvent[], to:'client'|'server'): string =>
    `The following game event is not found on '${to}' event repository:\n${stringifyWithDetailledSetAndMap(expectedEvent)}
    List of current ${to} events:\n${existingEvents.map(event => stringifyWithDetailledSetAndMap(event)).join('\n')}`
