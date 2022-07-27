import { GameEvent } from '../type/GameEvent'
export interface System {
    onGameEvent(gameEvent:GameEvent):Promise<void>
}
