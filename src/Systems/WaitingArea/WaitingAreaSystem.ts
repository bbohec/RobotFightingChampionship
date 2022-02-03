import { maxPlayerPerMatch } from '../../Components/port/maxPlayerPerMatch'
import { createMatchEvent, createPlayerSimpleMatchLobbyMenu } from '../../Events/create/create'
import { playerJoinMatchEvent } from '../../Events/join/join'
import { GameEvent } from '../../Event/GameEvent'
import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { EntityReference } from '../../Components/EntityReference'
import { drawEvent } from '../../Events/draw/draw'
import { Physical } from '../../Components/Physical'

export class WaitingAreaSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.hasEntitiesByEntityType(EntityType.simpleMatchLobby)
            ? this.onSimpleMatchLobbyEvent(gameEvent)
            : this.sendErrorMessageOnUnknownEventAction(gameEvent)
    }

    private onSimpleMatchLobbyEvent (gameEvent:GameEvent):Promise<void> {
        const simpleMatchLobbyEntityId = gameEvent.entityByEntityType(EntityType.simpleMatchLobby)
        const simpleMatchLobbyEntityReference = this.interactWithEntities.retrieveEntityComponentByEntityId(simpleMatchLobbyEntityId, EntityReference)
        if (!simpleMatchLobbyEntityReference.hasReferences(EntityType.player)) simpleMatchLobbyEntityReference.entityReferences.set(EntityType.player, [])
        const players = simpleMatchLobbyEntityReference.retrieveReferences(EntityType.player)
        return gameEvent.action === Action.waitingForPlayers
            ? this.onMatchWaitingForPlayersEvent(gameEvent.entityByEntityType(EntityType.match), players)
            : gameEvent.action === Action.join
                ? this.onPlayerJoinGameEvent(gameEvent.entityByEntityType(EntityType.player), players, simpleMatchLobbyEntityId)
                : this.sendErrorMessageOnUnknownEventAction(gameEvent)
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
        const mainMenuId = this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference).retrieveReference(EntityType.mainMenu)
        const playerSimpleMatchLobbyButtonId = this.playerSimpleMatchLobbyButtonId(playerId, simpleMatchLobbyEntityId)
        const mainMenuPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(mainMenuId, Physical)
        mainMenuPhysicalComponent.visible = false
        const simpleMatchLobbyButtonPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(playerSimpleMatchLobbyButtonId, Physical)
        simpleMatchLobbyButtonPhysicalComponent.visible = false
        const events:GameEvent[] = [
            drawEvent(playerId, mainMenuPhysicalComponent),
            drawEvent(playerId, simpleMatchLobbyButtonPhysicalComponent),
            createPlayerSimpleMatchLobbyMenu(playerId)
        ]
        const createMatchEvent = this.createMatchWhenEnoughWaitingPlayers(playersIds, simpleMatchLobbyEntityId)
        if (createMatchEvent) events.push(createMatchEvent)
        return this.sendEvents(events)
    }

    private playerSimpleMatchLobbyButtonId (playerId: string, simpleMatchLobbyEntityId: string):string {
        const playerButtons = this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference).retrieveReferences(EntityType.button)
        const simpleMatchLobbyButtons = this.interactWithEntities.retrieveEntityComponentByEntityId(simpleMatchLobbyEntityId, EntityReference).retrieveReferences(EntityType.button)
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

    protected getSystemName (): string {
        return WaitingAreaSystem.name
    }
}
