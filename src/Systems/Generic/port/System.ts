import { GameEventContract } from '../../../Event/GameEvent'
export interface System {
    onGameEvent(gameEvent:GameEventContract):Promise<void>
}
