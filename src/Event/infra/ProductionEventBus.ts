import { GameEvent } from '../GameEvent.js'
import { EventBus } from '../port/EventBus.js'
import { GenericGameSystem } from '../../Systems/Game/GenericGame.js'

export class ProductionEventBus implements EventBus {
    send (gameEvent: GameEvent): Promise<void> {
        return (this.gameSystem)
            ? this.gameSystem.onGameEvent(gameEvent)
            : Promise.reject(new Error('Gamesystem is not set.'))
    }

    setGameSystem (gameSystem:GenericGameSystem) {
        this.gameSystem = gameSystem
    }

    private gameSystem?: GenericGameSystem
}
