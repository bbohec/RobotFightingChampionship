import { hasReferences, retrieveReference, retrieveReferences } from '../../core/components/EntityReference'
import { maxPlayerPerMatch } from '../../core/components/Phasing'
import { Physical } from '../../core/components/Physical'
import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../core/type/GameEvent'
import { createMatchEvent, createPlayerSimpleMatchLobbyMenu } from '../../core/events/create/create'
import { drawEvent } from '../../core/events/draw/draw'
import { playerJoinMatchEvent } from '../../core/events/join/join'
import { GenericServerSystem } from '../Generic/GenericServerSystem'

export class WaitingAreaSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.simpleMatchLobby)
            ? this.onSimpleMatchLobbyEvent(gameEvent)
            : Promise.reject(new Error(errorMessageOnUnknownEventAction(WaitingAreaSystem.name, gameEvent)))
    }

    private onSimpleMatchLobbyEvent (gameEvent:GameEvent):Promise<void> {
        const simpleMatchLobbyEntityId = this.entityByEntityType(gameEvent, EntityType.simpleMatchLobby)
        const simpleMatchLobbyEntityReference = this.interactWithEntities.retreiveEntityReference(simpleMatchLobbyEntityId)
        if (!hasReferences(simpleMatchLobbyEntityReference, EntityType.player)) simpleMatchLobbyEntityReference.entityReferences.set(EntityType.player, [])
        const players = retrieveReferences(simpleMatchLobbyEntityReference, EntityType.player)
        return gameEvent.action === Action.waitingForPlayers
            ? this.onMatchWaitingForPlayersEvent(this.entityByEntityType(gameEvent, EntityType.match), players)
            : gameEvent.action === Action.join
                ? this.onPlayerJoinGameEvent(this.entityByEntityType(gameEvent, EntityType.player), players, simpleMatchLobbyEntityId)
                : Promise.reject(new Error(errorMessageOnUnknownEventAction(WaitingAreaSystem.name, gameEvent)))
    }

    private onMatchWaitingForPlayersEvent (matchId: string, playerIds: string[]):Promise<void> {
        const isEnoughPlayers = (players: string[]) => players.length >= maxPlayerPerMatch
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

    private onPlayerJoinGameEvent (playerId: string, playersIds: string[], simpleMatchLobbyEntityId:string) {
        playersIds.push(playerId)
        const mainMenuId = retrieveReference(this.interactWithEntities.retreiveEntityReference(playerId), EntityType.mainMenu)
        const playerSimpleMatchLobbyButtonId = this.playerSimpleMatchLobbyButtonId(playerId, simpleMatchLobbyEntityId)
        const mainMenuPhysicalComponent = this.interactWithEntities.retrievePhysical(mainMenuId)
        const updatedMainMenuPhysicalComponent:Physical = {
            ...mainMenuPhysicalComponent,
            visible: false
        }
        const simpleMatchLobbyButtonPhysicalComponent = this.interactWithEntities.retrievePhysical(playerSimpleMatchLobbyButtonId)
        const updatedSimpleMatchLobbyButtonPhysicalComponent:Physical = {
            ...simpleMatchLobbyButtonPhysicalComponent,
            visible: false
        }
        const events:GameEvent[] = [
            drawEvent(playerId, updatedMainMenuPhysicalComponent),
            drawEvent(playerId, updatedSimpleMatchLobbyButtonPhysicalComponent),
            createPlayerSimpleMatchLobbyMenu(playerId)
        ]
        const createMatchEvent = this.createMatchWhenEnoughWaitingPlayers(playersIds, simpleMatchLobbyEntityId)
        if (createMatchEvent) events.push(createMatchEvent)
        return this.sendEvents(events)
    }

    private playerSimpleMatchLobbyButtonId (playerId: string, simpleMatchLobbyEntityId: string):string {
        const playerButtons = retrieveReferences(this.interactWithEntities.retreiveEntityReference(playerId), EntityType.button)
        const simpleMatchLobbyButtons = retrieveReferences(this.interactWithEntities.retreiveEntityReference(simpleMatchLobbyEntityId), EntityType.button)
        const playerSimpleMatchButton = playerButtons.filter(playerButtonId => simpleMatchLobbyButtons.some(simpleMatchButtonId => simpleMatchButtonId === playerButtonId))
        if (playerSimpleMatchButton.length === 1) return playerSimpleMatchButton[0]
        if (playerSimpleMatchButton.length === 0) throw new Error('No player simple match button found.')
        throw new Error('Multiple player simple match button found.')
    }

    private createMatchWhenEnoughWaitingPlayers (playerIds: string[], simpleMatchLobbyEntityId:string): GameEvent|undefined {
        const isEnoughWaitingPlayers = (players: string[]) => players.length % maxPlayerPerMatch === 0
        return (isEnoughWaitingPlayers(playerIds))
            ? createMatchEvent(simpleMatchLobbyEntityId)
            : undefined
    }
}
