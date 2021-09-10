import { GameEventContract } from '../../../Event/GameEvent'

export interface EventInteractor {
    sendEvent(gameEvent: GameEventContract): Promise<void>;

}
