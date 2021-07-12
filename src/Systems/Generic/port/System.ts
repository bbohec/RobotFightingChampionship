import { GameEvent } from '../../../Event/GameEvent'
export interface System {
    onGameEvent(gameEvent:GameEvent):Promise<void>
}
