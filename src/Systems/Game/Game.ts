import { GameEvent } from '../../Events/port/GameEvent'
import { GenericSystem } from '../Generic/GenericSystem'

export class Game extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return Promise.resolve()
    }
}
