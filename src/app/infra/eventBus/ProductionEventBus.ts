
import { EventBus } from '../../core/port/EventBus'
import { Logger } from '../../core/port/Logger'
import { GenericGameSystem } from '../../core/system/GenericGameSystem'
import { GameEvent } from '../../core/type/GameEvent'
import { stringifyWithDetailledSetAndMap } from '../../messages'

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
