import { Playable } from '../../Components/Playable'
import { createMatchEvent } from '../../Events/create/create'
import { playerJoinMatchEvent } from '../../Events/join/join'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericSystem } from '../Generic/GenericSystem'
import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'

export class WaitingAreaSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.simpleMatchLobby)) return this.simpleMatchLobbyEvent(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(WaitingAreaSystem.name, gameEvent))
    }

    private simpleMatchLobbyEvent (gameEvent:GameEvent):Promise<void> {
        const simpleMatchLobbyEntityId = gameEvent.entityByEntityType(EntityType.simpleMatchLobby)
        const players = this.interactWithEntities.retrieveEntityById(simpleMatchLobbyEntityId).retrieveComponent(Playable).players
        if (gameEvent.action === Action.waitingForPlayers) return this.onMatchWaitingForPlayersEvent(gameEvent.entityByEntityType(EntityType.match), players)
        if (gameEvent.action === Action.join) return this.onPlayerJoinGameEvent(gameEvent.entityByEntityType(EntityType.player), players, simpleMatchLobbyEntityId)
        throw new Error(errorMessageOnUnknownEventAction(WaitingAreaSystem.name, gameEvent))
    }

    private onMatchWaitingForPlayersEvent (matchId: string, playerIds: string[]):Promise<void> {
        const isEnoughPlayers = (players: string[]) => players.length >= 2
        return (isEnoughPlayers(playerIds))
            ? this.onEnoughPlayers(matchId, playerIds)
            : Promise.resolve()
    }

    private onEnoughPlayers (matchLobbyId: string, playerIds: string[]) {
        const playersToJoinMatch = [playerIds.shift()!, playerIds.shift()!]
        return Promise.all(playersToJoinMatch.map(playerId => this.sendEvent(playerJoinMatchEvent(playerId, matchLobbyId))))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private onPlayerJoinGameEvent (playerId: string, playersIds: string[], simpleMatchLobbyEntityId:string) {
        playersIds.push(playerId)
        return this.createMatchForEachTwoPlayers(playersIds, simpleMatchLobbyEntityId)
    }

    private createMatchForEachTwoPlayers (playerIds: string[], simpleMatchLobbyEntityId:string): Promise<void> {
        const isEvenPlayers = (players: string[]) => players.length % 2 === 0
        return (isEvenPlayers(playerIds))
            ? this.sendEvent(createMatchEvent(simpleMatchLobbyEntityId))
            : Promise.resolve()
    }
}
