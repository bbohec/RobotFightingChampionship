import { GameEvent } from '../../Event/GameEvent'
import { stringifyWithDetailledSetAndMap } from '../../Event/test'
import { EventBus } from '../../Event/port/EventBus'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'

export interface NewEventInteractor {
    sendEventToClient(gameEvent: GameEvent): Promise<void>
    sendEventToServer(gameEvent: GameEvent): Promise<void>
    eventBus:EventBus
    start():void
    stop():void
}

export interface NewClientEventInteractor extends NewEventInteractor {
    clientId: string;
    sendEventToServer(gameEvent: GameEvent | SerializedGameEvent): Promise<void>;
}
export interface NewServerEventInteractor extends NewEventInteractor {
    sendEventToClient(gameEvent: GameEvent | SerializedGameEvent): Promise<void>;
}

export const gameEventNotFoundOnEventInteractor = (expectedEvent: GameEvent, existingEvents: GameEvent[], to:'client'|'server'): string =>
    `The following game event is not found on '${to}' event repository:\n${stringifyWithDetailledSetAndMap(expectedEvent)}
    List of current ${to} events:\n${existingEvents.map(event => stringifyWithDetailledSetAndMap(event)).join('\n')}`
