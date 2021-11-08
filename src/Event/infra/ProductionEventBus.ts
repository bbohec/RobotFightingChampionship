import { GameEvent } from '../GameEvent'
import { EventBus } from '../port/EventBus'
import { GenericGameSystem } from '../../Systems/Game/GenericGame'
import { stringifyWithDetailledSetAndMap } from '../detailledStringify'

export class ProductionEventBus implements EventBus {
    send (gameEvent: GameEvent): Promise<void> {
        console.log('Event Bus', stringifyWithDetailledSetAndMap(gameEvent))
        return (this.gameSystem)
            ? this.gameSystem.onGameEvent(gameEvent)
            : Promise.reject(new Error('Gamesystem is not set.'))
    }

    setGameSystem (gameSystem:GenericGameSystem) {
        this.gameSystem = gameSystem
    }

    private gameSystem?: GenericGameSystem
}
