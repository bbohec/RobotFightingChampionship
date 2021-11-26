import { maxPlayerPerMatch, Playable } from '../../Components/Playable'
import { createMatchEvent, createPlayerSimpleMatchLobbyMenu } from '../../Events/create/create'
import { playerJoinMatchEvent } from '../../Events/join/join'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { EntityReference } from '../../Components/EntityReference'
import { drawEvent } from '../../Events/show/draw'
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
        const mainMenuId = this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference).retreiveReference(EntityType.mainMenu)
        const playerSimpleMatchLobbyButtonId = this.playerSimpleMatchLobbyButtonId(playerId, simpleMatchLobbyEntityId)
        const mainMenuPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(mainMenuId, Physical)
        mainMenuPhysicalComponent.visible = false
        const simpleMatchLobbyButtonPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(playerSimpleMatchLobbyButtonId, Physical)
        simpleMatchLobbyButtonPhysicalComponent.visible = false
        return Promise.all([
            this.createMatchForEachTwoPlayers(playersIds, simpleMatchLobbyEntityId),
            this.sendEvent(drawEvent(EntityType.mainMenu, mainMenuId, playerId, mainMenuPhysicalComponent)),
            this.sendEvent(drawEvent(EntityType.button, playerSimpleMatchLobbyButtonId, playerId, simpleMatchLobbyButtonPhysicalComponent)),
            this.sendEvent(createPlayerSimpleMatchLobbyMenu(playerId))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private playerSimpleMatchLobbyButtonId (playerId: string, simpleMatchLobbyEntityId: string):string {
        const playerButtons = this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference).retrieveReferences(EntityType.button)
        const simpleMatchLobbyButtons = this.interactWithEntities.retrieveEntityComponentByEntityId(simpleMatchLobbyEntityId, EntityReference).retrieveReferences(EntityType.button)
        const playerSimpleMatchButton = playerButtons.filter(playerButtonId => simpleMatchLobbyButtons.some(simpleMatchButtonId => simpleMatchButtonId === playerButtonId))
        if (playerSimpleMatchButton.length === 1) return playerSimpleMatchButton[0]
        if (playerSimpleMatchButton.length === 0) throw new Error('No player simple match button found.')
        throw new Error('Multiple player simple match button found.')
    }

    private createMatchForEachTwoPlayers (playerIds: string[], simpleMatchLobbyEntityId:string): Promise<void> {
        const isEvenPlayers = (players: string[]) => players.length % maxPlayerPerMatch === 0
        return (isEvenPlayers(playerIds))
            ? this.sendEvent(createMatchEvent(simpleMatchLobbyEntityId))
            : Promise.resolve()
    }
}
