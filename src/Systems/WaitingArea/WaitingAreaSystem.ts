import { maxPlayerPerMatch, Playable } from '../../Components/Playable'
import { createMatchEvent } from '../../Events/create/create'
import { playerJoinMatchEvent } from '../../Events/join/join'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { hideEvent } from '../../Events/hide/hide'
import { EntityId } from '../../Event/entityIds'
import { showEvent } from '../../Events/show/show'
import { Physical } from '../../Components/Physical'

export class WaitingAreaSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.simpleMatchLobby)) return this.simpleMatchLobbyEvent(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(WaitingAreaSystem.name, gameEvent))
    }

    private simpleMatchLobbyEvent (gameEvent:GameEvent):Promise<void> {
        const simpleMatchLobbyEntityId = gameEvent.entityByEntityType(EntityType.simpleMatchLobby)
        const players = this.interactWithEntities.retrieveEntityComponentByEntityId(simpleMatchLobbyEntityId, Playable).players
        if (gameEvent.action === Action.waitingForPlayers) return this.onMatchWaitingForPlayersEvent(gameEvent.entityByEntityType(EntityType.match), players)
        if (gameEvent.action === Action.join) return this.onPlayerJoinGameEvent(gameEvent.entityByEntityType(EntityType.player), players, simpleMatchLobbyEntityId)
        throw new Error(errorMessageOnUnknownEventAction(WaitingAreaSystem.name, gameEvent))
    }

    private onMatchWaitingForPlayersEvent (matchId: string, playerIds: string[]):Promise<void> {
        const isEnoughPlayers = (players: string[]) => players.length >= maxPlayerPerMatch
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
        return Promise.all([
            this.createMatchForEachTwoPlayers(playersIds, simpleMatchLobbyEntityId),
            this.sendEvent(hideEvent(EntityType.mainMenu, EntityId.mainMenu, playerId)),
            this.sendEvent(showEvent(EntityType.simpleMatchLobby, simpleMatchLobbyEntityId, playerId, this.interactWithEntities.retrieveEntityComponentByEntityId(simpleMatchLobbyEntityId, Physical)))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private createMatchForEachTwoPlayers (playerIds: string[], simpleMatchLobbyEntityId:string): Promise<void> {
        const isEvenPlayers = (players: string[]) => players.length % maxPlayerPerMatch === 0
        return (isEvenPlayers(playerIds))
            ? this.sendEvent(createMatchEvent(simpleMatchLobbyEntityId))
            : Promise.resolve()
    }
}
