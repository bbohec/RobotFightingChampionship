import { GameEvent } from '../../../core/type/GameEvent'
export interface System {
    onGameEvent(gameEvent:GameEvent):Promise<void>
}
