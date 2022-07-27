import { GameEvent } from '../type/GameEvent'

export interface EventBus {
    send(gameEvent: GameEvent): Promise<void>;
}
