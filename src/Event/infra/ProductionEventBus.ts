import { GameEvent } from '../GameEvent'
import { EventBus } from '../port/EventBus'
import { GenericGameSystem } from '../../Systems/Game/GenericGame'
import { stringifyWithDetailledSetAndMap } from '../detailledStringify'
import { Logger } from '../../Log/port/logger'

export class ProductionEventBus implements EventBus {
    constructor (logger:Logger) {
        this.logger = logger
    }

    send (gameEvent: GameEvent): Promise<void> {
        this.logger.info('Event Bus', stringifyWithDetailledSetAndMap(gameEvent))
        return (this.gameSystem)
            ? this.gameSystem.onGameEvent(gameEvent)
            : Promise.reject(new Error('Gamesystem is not set.'))
    }

    setGameSystem (gameSystem:GenericGameSystem) {
        this.gameSystem = gameSystem
    }

    private gameSystem?: GenericGameSystem
    private logger:Logger
}
