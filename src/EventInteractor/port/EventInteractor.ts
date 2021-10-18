import { GameEvent } from '../../Event/GameEvent'
import { stringifyWithDetailledSetAndMap } from '../../Event/test'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'
export interface EventInteractor {
    sendEventToServer(gameEvent: GameEvent|SerializedGameEvent): Promise<void>;
    sendEventToClient(gameEvent: GameEvent|SerializedGameEvent): Promise<void>;
}

export const gameEventNotFoundOnEventRepository = (expectedEvent: GameEvent, existingEvents: GameEvent[], to:'client'|'server'): string =>
    `The following game event is not found on '${to}' event repository:\n${stringifyWithDetailledSetAndMap(expectedEvent)}
    List of current ${to} events:\n${existingEvents.map(event => stringifyWithDetailledSetAndMap(event)).join('\n')}`
