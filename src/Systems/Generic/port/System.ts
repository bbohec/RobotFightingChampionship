import { GameEvent } from '../../../Events/port/GameEvent'
export interface System {
    onGameEvent(gameEvent:GameEvent):Promise<void>
}
