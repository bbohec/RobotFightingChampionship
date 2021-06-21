import { GameEvent } from '../../Events/port/GameEvent'
import { createSimpleMatchLobbyEvent, errorMessageOnUnknownEventAction, MatchWaitingForPlayers } from '../../Events/port/GameEvents'
import { ServerGame } from '../../Entities/ServerGame/ServerGame'
import { ServerGameEventDispatcherSystem } from '../GameEventDispatcher/ServerGameEventDispatcherSystem'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby/SimpleMatchLobby'
import { Match } from '../../Entities/Match/Match'
import { Playable } from '../../Component/Playable'
export class ServerLifeCycleSystem extends GenericLifeCycleSystem {
    protected sendOptionnalNextEvent (nextEvent: GameEvent | undefined): Promise<void> {
        return (nextEvent !== undefined) ? this.interactWithSystems.retrieveSystemByClass(ServerGameEventDispatcherSystem).sendEvent(nextEvent) : Promise.resolve()
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const nextIdentifier = this.interactWithIdentiers.nextIdentifier()
        if (gameEvent.destination === 'Server Game') return this.createEntity(new ServerGame('Server Game'), [], createSimpleMatchLobbyEvent)
        if (gameEvent.destination === 'Simple Match Lobby') return this.createEntity(new SimpleMatchLobby('Simple Match Lobby'), [new Playable('Simple Match Lobby')])
        if (gameEvent.destination === 'Match') return this.createEntity(new Match(nextIdentifier), [new Playable(nextIdentifier)], MatchWaitingForPlayers(nextIdentifier))
        throw new Error(errorMessageOnUnknownEventAction(ServerLifeCycleSystem.name, gameEvent))
    }
}
