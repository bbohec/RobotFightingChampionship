import { EventBus } from '../../../core/port/EventBus'
import { ServerEventInteractor, ClientEventInteractor } from '../../../core/port/EventInteractor'
import { GameEventHandler } from '../../../core/system/GameEventHandler'
import { EntityType } from '../../../core/type/EntityType'
import { GameEvent } from '../../../core/type/GameEvent'
import { InMemoryClientEventInteractor } from '../client/InMemoryClientEventInteractor'

export class InMemoryServerEventInteractor extends GameEventHandler implements ServerEventInteractor {
    constructor (
        public eventBus: EventBus,
        public clientEventInteractors: InMemoryClientEventInteractor[]
    ) { super() }

    setClientEventInteractors (clientEventInteractors: InMemoryClientEventInteractor[]) {
        this.clientEventInteractors = clientEventInteractors
    }

    sendEventToClient (gameEvent: GameEvent): Promise<void> {
        return (this.clientEventInteractors)
            ? this.clientEventInteractorByGameEventPlayerId(gameEvent).eventBus.send(gameEvent)
            : Promise.resolve()
    }

    clientEventInteractorByGameEventPlayerId (gameEvent: GameEvent): ClientEventInteractor {
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        const clientEventInteractor = this.clientEventInteractors?.find(clientEventInteractor => clientEventInteractor.clientId === playerId)
        if (clientEventInteractor) return clientEventInteractor
        throw new Error(`Client event interactor with client id '${playerId}' missing.`)
    }

    sendEventToServer (gameEvent: GameEvent): Promise<void> {
        return this.eventBus.send(gameEvent)
    }

    start (): Promise<void> {
        return Promise.resolve()
    }

    stop (): Promise<void> {
        return Promise.resolve()
    }
}
