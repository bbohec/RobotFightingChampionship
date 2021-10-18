import { GameEvent } from '../GameEvent'

export interface EventBus {
    send(gameEvent: GameEvent): Promise<void>;
}
