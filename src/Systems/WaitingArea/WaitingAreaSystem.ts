import { Playable } from '../../Component/Playable'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby/SimpleMatchLobby'
import { GameEvent } from '../../Events/port/GameEvent'
import { createMatchEvent, errorMessageOnUnknownEventAction, playerJoinMatch } from '../../Events/port/GameEvents'
import { ServerGameEventDispatcherSystem } from '../GameEventDispatcher/ServerGameEventDispatcherSystem'
import { GenericSystem } from '../Generic/GenericSystem'

export class WaitingAreaSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.destination === 'Simple Match Lobby') {
            const players = this.interactWithEntities.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players
            if (gameEvent.message === 'Waiting for players' && players.length > 1) {
                const playersToJoinMatch = [players.shift()!, players.shift()!]
                return Promise.all(playersToJoinMatch.map(player => this.interactWithSystems.retrieveSystemByClass(ServerGameEventDispatcherSystem).sendEvent(playerJoinMatch(player, gameEvent.sourceRef))))
                    .then(() => Promise.resolve())
                    .catch(error => Promise.reject(error))
            } else return this.addPlayer(players, gameEvent)
        }
        throw new Error(errorMessageOnUnknownEventAction(WaitingAreaSystem.name, gameEvent))
    }

    private addPlayer (players: string[], gameEvent: GameEvent):Promise<void> {
        players.push(gameEvent.sourceRef)
        return (players.length % 2 === 0)
            ? this.interactWithSystems.retrieveSystemByClass(ServerGameEventDispatcherSystem).sendEvent(createMatchEvent)
            : Promise.resolve()
    }
}
