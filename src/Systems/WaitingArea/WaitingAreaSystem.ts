import { Playable } from '../../Component/Playable'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby'
import { createMatchEvent } from '../../Events/create/create'
import { playerJoinMatchEvent } from '../../Events/join/join'
import { GameEvent } from '../../Events/port/GameEvent'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId } from '../../Events/port/GameEvents'
import { GenericSystem } from '../Generic/GenericSystem'

export class WaitingAreaSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.targetEntityType === 'Simple Match Lobby') return this.onSimpleMatchLobbyTarget(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(WaitingAreaSystem.name, gameEvent))
    }

    private onSimpleMatchLobbyTarget (gameEvent:GameEvent):Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        const players = this.interactWithEntities.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players
        return (gameEvent.action === 'Waiting for players')
            ? this.onWaitingForPlayersEvent(gameEvent.originEntityId, players)
            : this.onNotWaitingForPlayersEvent(gameEvent.originEntityId, players)
    }

    private onNotWaitingForPlayersEvent (playerId: string, playersIds: string[]) {
        playersIds.push(playerId)
        return this.createMatchForEachTwoPlayers(playersIds)
    }

    private onWaitingForPlayersEvent (matchId: string, playerIds: string[]):Promise<void> {
        const isEnoughPlayers = (players: string[]) => players.length >= 2
        return (isEnoughPlayers(playerIds))
            ? this.onEnoughPlayers(matchId, playerIds)
            : Promise.resolve()
    }

    private onEnoughPlayers (matchId: string, playerIds: string[]) {
        const playersToJoinMatch = [playerIds.shift()!, playerIds.shift()!]
        return Promise.all(playersToJoinMatch.map(playerId => this.sendEvent(playerJoinMatchEvent(playerId, matchId))))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private createMatchForEachTwoPlayers (playerIds: string[]): Promise<void> {
        const isEvenPlayers = (players: string[]) => players.length % 2 === 0
        return (isEvenPlayers(playerIds))
            ? this.sendEvent(createMatchEvent)
            : Promise.resolve()
    }
}
