import { GameEvent } from '../../../Event/GameEvent'
import { stringifyWithDetailledSetAndMap } from '../../../Event/test'

export interface EventInteractor {
    sendEvent(gameEvent: GameEvent): Promise<void>;
}
export const gameEventNotFoundOnEventRepository = (expectedEvent: GameEvent, existingEvents: GameEvent[]): string =>
    `The following game event is not found on event repository:\n${stringifyWithDetailledSetAndMap(expectedEvent)}
    List of current events:\n${existingEvents.map(event => stringifyWithDetailledSetAndMap(event)).join('\n')}`
