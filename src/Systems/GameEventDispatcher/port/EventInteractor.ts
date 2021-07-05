import { GameEvent } from '../../../Events/port/GameEvent'

export interface EventInteractor {
    sendEvent(gameEvent: GameEvent): Promise<void>;

}
