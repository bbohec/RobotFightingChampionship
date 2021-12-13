import { GameEvent } from '../../Event/GameEvent'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'
import { ClientEventInteractor, ServerEventInteractor } from '../port/EventInteractor'
import { EventBus } from '../../Event/port/EventBus'
import { InMemoryClientEventInteractor } from './InMemoryClientEventInteractor'
import { ComponentBuilder } from '../../Components/port/ComponentBuilder'
import { ComponentSerializer } from '../../Components/port/ComponentSerializer'
import { EntityType } from '../../Event/EntityType'
import { playerARobotManualPlacementPhase } from '../../Components/Phasing'

export class InMemoryServerEventInteractor implements ServerEventInteractor {
    private clientEventInteractors: InMemoryClientEventInteractor[] | undefined;

    setClientEventInteractors (clientEventInteractors: InMemoryClientEventInteractor[]) {
        this.clientEventInteractors = clientEventInteractors
    }

    constructor (eventBus: EventBus) {
        this.eventBus = eventBus
    }

    sendEventToClient (gameEvent: GameEvent | SerializedGameEvent): Promise<void> {
        if (this.clientEventInteractors && gameEvent instanceof GameEvent)
            return this.clientEventInteractorByGameEventPlayerId(gameEvent).eventBus.send(gameEvent);
        (gameEvent instanceof GameEvent)
            ? this.eventBus.send(gameEvent)
            : this.eventBus.send(new GameEvent({
                action: gameEvent.action,
                components: gameEvent.components.map(component => this.componentBuilder.buildComponent(component)),
                entityRefences: gameEvent.entityRefences
            }))
        return Promise.resolve()
    }

    clientEventInteractorByGameEventPlayerId (gameEvent: GameEvent): ClientEventInteractor {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const clientEventInteractor = this.clientEventInteractors?.find(clientEventInteractor => clientEventInteractor.clientId === playerId)
        if (clientEventInteractor) return clientEventInteractor
        throw new Error(`Client event interactor with client id '${playerId}' missing.`)
    }

    sendEventToServer (gameEvent: GameEvent): Promise<void> {
        return this.eventBus.send(gameEvent)
    }

    eventBus: EventBus;
    start (): Promise<void> {
        return Promise.resolve()
    }

    stop ():  Promise<void>  {
        return Promise.resolve()
    }

    private componentBuilder = new ComponentBuilder();
    private componentSerializer = new ComponentSerializer();
}
