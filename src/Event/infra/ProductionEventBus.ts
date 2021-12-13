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
        return this.sendEventOnGameSystem(gameEvent)
    }

    private sendEventOnGameSystem (gameEvent: GameEvent): Promise<void> {
        this.logger.info('Event Bus', stringifyWithDetailledSetAndMap(gameEvent))
        return (this.gameSystem)
            // ? this.asyncSendEventOnGameSystem(this.gameSystem, gameEvent)
            ? this.gameSystem.onGameEvent(gameEvent)
            : Promise.reject(new Error('Gamesystem is not set.'))
    }

    /* private asyncSendEventOnGameSystem (gameSystem: GenericGameSystem, gameEvent: GameEvent) {
        gameSystem.onGameEvent(gameEvent).catch(error => this.logger.error(error))
        return Promise.resolve()
    } */

    setGameSystem (gameSystem:GenericGameSystem) {
        this.gameSystem = gameSystem
    }

    private gameSystem?: GenericGameSystem
    private logger:Logger
}
