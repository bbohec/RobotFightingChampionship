import { GameEvent } from '../../../Event/GameEvent'

export interface EventInteractor {
    sendEvent(gameEvent: GameEvent): Promise<void>;

}
