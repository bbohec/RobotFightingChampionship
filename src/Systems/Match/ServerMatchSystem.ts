import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { maxPlayerPerMatch } from '../../Components/port/maxPlayerPerMatch'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { EntityReference } from '../../Components/EntityReference'
import { playerReadyForMatch } from '../../Events/ready/ready'
import { createGridEvent, createPlayerNextTurnMatchButtonEvent, createRobotEvent, createTowerEvent } from '../../Events/create/create'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../../Events/destroy/destroy'
import { playerNotFoundOnMatchPlayers } from './port/matchSystem'
import { Physical } from '../../Components/Physical'
import { drawEvent } from '../../Events/show/draw'
import { matchGridDimension } from '../../Components/port/Dimension'

export class ServerMatchSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === Action.register
            ? this.onRegister(gameEvent)
            : gameEvent.action === Action.join
                ? this.onJoin(gameEvent, this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), EntityReference))
                : gameEvent.action === Action.quit
                    ? this.onQuit(gameEvent, this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), EntityReference))
                    : Promise.reject(new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent)))
    }

    private onRegister (gameEvent:GameEvent):Promise<void> {
        return gameEvent.hasEntitiesByEntityType(EntityType.game)
            ? this.onRegisterSimpleMatchLobbyOnGame(gameEvent)
            : gameEvent.hasEntitiesByEntityType(EntityType.robot)
                ? this.onRegisterEntityOnPlayer(gameEvent, this.entityReferencesByEntityId(gameEvent.entityByEntityType(EntityType.player)), EntityType.robot)
                : gameEvent.hasEntitiesByEntityType(EntityType.tower)
                    ? this.onRegisterEntityOnPlayer(gameEvent, this.entityReferencesByEntityId(gameEvent.entityByEntityType(EntityType.player)), EntityType.tower)
                    : gameEvent.hasEntitiesByEntityType(EntityType.nextTurnButton)
                        ? this.onRegisterEntityOnPlayer(gameEvent, this.entityReferencesByEntityId(gameEvent.entityByEntityType(EntityType.player)), EntityType.nextTurnButton)
                        : Promise.reject(new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent)))
    }

    private onRegisterSimpleMatchLobbyOnGame (gameEvent: GameEvent): Promise<void> {
        this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.game), EntityReference)
            .entityReferences.set(EntityType.simpleMatchLobby, [gameEvent.entityByEntityType(EntityType.simpleMatchLobby)])
        return Promise.resolve()
    }

    private onQuit (gameEvent: GameEvent, entityReferenceComponent:EntityReference): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.removePlayerFromEntityReferenceComponent(entityReferenceComponent, playerId)
        return this.onPlayerRemoved(entityReferenceComponent, playerId)
    }

    private onPlayerRemoved (EntityReferenceComponent: EntityReference, playerId:string): Promise<void> {
        const playerMainMenuId = this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference).retrieveReference(EntityType.mainMenu)
        const playerEntityReference = this.entityReferencesByEntityId(playerId)
        const physicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(playerMainMenuId, Physical)
        physicalComponent.visible = true
        const events:GameEvent[] = [
            destroyRobotEvent(playerEntityReference.retrieveReference(EntityType.robot)),
            destroyTowerEvent(playerEntityReference.retrieveReference(EntityType.tower)),
            drawEvent(EntityType.mainMenu, playerMainMenuId, playerId, physicalComponent)
        ]
        if (!EntityReferenceComponent.hasReferences(EntityType.player)) events.push(destroyMatchEvent(EntityReferenceComponent.entityId))
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private removePlayerFromEntityReferenceComponent (entityReferenceComponent: EntityReference, quitingPlayerId: string) {
        const players = entityReferenceComponent.retrieveReferences(EntityType.player)
        console.log(players)
        const playerIndex = players.findIndex(playerId => playerId === quitingPlayerId)
        if (playerIndex < 0) throw new Error(playerNotFoundOnMatchPlayers(quitingPlayerId))
        players.splice(playerIndex, 1)
        entityReferenceComponent.entityReferences.set(EntityType.player, players)
    }

    private onRegisterEntityOnPlayer (gameEvent: GameEvent, playerEntityReference: EntityReference, entityType: EntityType): Promise<void> {
        this.interactWithEntities.linkEntityToEntities(gameEvent.entityByEntityType(entityType), [playerEntityReference.entityId])
        if (entityType === EntityType.nextTurnButton) this.interactWithEntities.linkEntityToEntities(gameEvent.entityByEntityType(entityType), [gameEvent.entityByEntityType(EntityType.match)])
        return (this.isPlayerReadyForMatch(playerEntityReference))
            ? this.onPlayerReadyForMatch(playerEntityReference.entityId, playerEntityReference.retrieveReference(EntityType.match))
            : Promise.resolve()
    }

    private isPlayerReadyForMatch (entityReferenceComponent:EntityReference):Boolean {
        return (
            entityReferenceComponent.entityReferences.has(EntityType.robot) &&
            entityReferenceComponent.entityReferences.has(EntityType.tower) &&
            entityReferenceComponent.entityReferences.has(EntityType.nextTurnButton)
        )
    }

    private onPlayerReadyForMatch (playerId:string, matchId:string) {
        return this.sendEvent(playerReadyForMatch(matchId, playerId))
    }

    private onJoin (gameEvent: GameEvent, matchEntityReference:EntityReference): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        if (!matchEntityReference.hasReferences(EntityType.player)) matchEntityReference.entityReferences.set(EntityType.player, [])
        const players = matchEntityReference.retrieveReferences(EntityType.player)
        players.push(playerId)
        //  console.warn(matchEntityReference.retrieveReferences(EntityType.player))
        this.entityReferencesByEntityId(playerId).entityReferences.set(EntityType.match, [matchId])
        return (this.isMatchHasAllPlayers(players))
            ? this.onMatchHasAllPlayers(players, matchId)
            : Promise.resolve()
    }

    private onMatchHasAllPlayers (playerIds: string[], matchId: string): Promise<void> {
        return Promise.all([
            this.sendEvent(createGridEvent(matchId, matchGridDimension)),
            ...playerIds.map(playerId => this.sendEvent(createTowerEvent(playerId))),
            ...playerIds.map(playerId => this.sendEvent(createRobotEvent(playerId))),
            ...playerIds.map(playerId => this.sendEvent(createPlayerNextTurnMatchButtonEvent(matchId, playerId)))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private isMatchHasAllPlayers (players: string[]): boolean {
        return players.length === maxPlayerPerMatch
    }
}
