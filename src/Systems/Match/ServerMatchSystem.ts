import { GenericServerSystem } from '../Generic/GenericServerSystem'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { maxPlayerPerMatch, Playable } from '../../Components/Playable'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { EntityReference } from '../../Components/EntityReference'
import { playerReadyForMatch } from '../../Events/ready/ready'
import { createGridEvent, createRobotEvent, createTowerEvent } from '../../Events/create/create'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../../Events/destroy/destroy'
import { showEvent } from '../../Events/show/show'
import { playerNotFoundOnMatchPlayers } from './port/matchSystem'
import { Physical } from '../../Components/Physical'

export class ServerMatchSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.register) return this.onRegister(gameEvent)
        const playableComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), Playable)
        if (gameEvent.action === Action.join) return this.onJoin(gameEvent, playableComponent)
        if (gameEvent.action === Action.quit) return this.onQuit(gameEvent, playableComponent)
        throw new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent))
    }

    private onRegister (gameEvent:GameEvent):Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.game)) return this.onRegisterSimpleMatchLobbyOnGame(gameEvent)
        if (gameEvent.hasEntitiesByEntityType(EntityType.grid)) return this.onRegisterGridOnMatch(gameEvent, this.entityReferencesByEntityId(gameEvent.entityByEntityType(EntityType.match)))
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const playerEntityReference = this.entityReferencesByEntityId(playerId)
        if (gameEvent.hasEntitiesByEntityType(EntityType.robot)) return this.onRegisterRobotOnPlayer(gameEvent, playerId, playerEntityReference)
        if (gameEvent.hasEntitiesByEntityType(EntityType.tower)) return this.onRegisterTowerOnPlayer(gameEvent, playerId, playerEntityReference)
        throw new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent))
    }

    private onRegisterSimpleMatchLobbyOnGame (gameEvent: GameEvent): Promise<void> {
        this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.game), EntityReference)
            .entityReferences.set(EntityType.simpleMatchLobby, [gameEvent.entityByEntityType(EntityType.simpleMatchLobby)])
        return Promise.resolve()
    }

    private onQuit (gameEvent: GameEvent, playableComponent:Playable): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.removePlayerFromPlayableComponent(playableComponent, playerId)
        return this.onPlayerRemoved(playableComponent, playerId)
    }

    private onPlayerRemoved (playableComponent: Playable, playerId:string): Promise<void> {
        const playerMainMenuId = this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference).retreiveReference(EntityType.mainMenu)
        const playerEntityReference = this.entityReferencesByEntityId(playerId)
        const events:GameEvent[] = [
            destroyRobotEvent(playerEntityReference.retreiveReference(EntityType.robot)),
            destroyTowerEvent(playerEntityReference.retreiveReference(EntityType.tower)),
            showEvent(EntityType.mainMenu, playerMainMenuId, playerId, this.interactWithEntities.retrieveEntityComponentByEntityId(playerMainMenuId, Physical))
        ]
        if (playableComponent.players.length === 0) events.push(destroyMatchEvent(playableComponent.entityId))
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private removePlayerFromPlayableComponent (playableComponent: Playable, quitingPlayerId: string) {
        const playerIndex = playableComponent.players.findIndex(playerId => playerId === quitingPlayerId)
        if (playerIndex < 0) throw new Error(playerNotFoundOnMatchPlayers(quitingPlayerId))
        playableComponent.players.splice(playerIndex, 1)
    }

    private onRegisterTowerOnPlayer (gameEvent: GameEvent, playerId:string, playerEntityReference:EntityReference): Promise<void> {
        const entityReferenceComponent = this.addEntityReference(playerEntityReference, gameEvent, EntityType.tower)
        return (this.isRobotAndTowerReferenced(entityReferenceComponent))
            ? this.onRobotAndTowerReferenced(playerId, playerEntityReference.retreiveReference(EntityType.match))
            : Promise.resolve()
    }

    private onRegisterRobotOnPlayer (gameEvent: GameEvent, playerId:string, playerEntityReference:EntityReference): Promise<void> {
        const entityReferenceComponent = this.addEntityReference(playerEntityReference, gameEvent, EntityType.robot)
        return (this.isRobotAndTowerReferenced(entityReferenceComponent))
            ? this.onRobotAndTowerReferenced(playerId, playerEntityReference.retreiveReference(EntityType.match))
            : Promise.resolve()
    }

    private isRobotAndTowerReferenced (entityReferenceComponent:EntityReference):Boolean {
        return (
            entityReferenceComponent.entityReferences.has(EntityType.robot) &&
            entityReferenceComponent.entityReferences.has(EntityType.tower)
        )
    }

    private addEntityReference (referenceComponent:EntityReference, event:GameEvent, entityType:EntityType):EntityReference {
        referenceComponent.entityReferences.set(entityType, [event.entityByEntityType(entityType)])
        return referenceComponent
    }

    private onRegisterGridOnMatch (gameEvent: GameEvent, matchEntityReference:EntityReference): Promise<void> {
        this.addEntityReference(matchEntityReference, gameEvent, EntityType.grid)
        return Promise.resolve()
    }

    private onRobotAndTowerReferenced (playerId:string, matchId:string) {
        return this.sendEvent(playerReadyForMatch(matchId, playerId))
    }

    private onJoin (gameEvent: GameEvent, playableComponent:Playable): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        const players = playableComponent.players
        players.push(playerId)
        this.entityReferencesByEntityId(playerId).entityReferences.set(EntityType.match, [matchId])
        return (this.isMatchHasAllPlayers(players))
            ? this.onMatchHasAllPlayers(players, matchId)
            : Promise.resolve()
    }

    private onMatchHasAllPlayers (playerIds: string[], matchId: string): Promise<void> {
        return Promise.all([
            ...playerIds.map(playerId => this.sendEvent(createTowerEvent(playerId))),
            ...playerIds.map(playerId => this.sendEvent(createRobotEvent(playerId))),
            this.sendEvent(createGridEvent(matchId))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private isMatchHasAllPlayers (players: string[]): boolean {
        return players.length === maxPlayerPerMatch
    }
}
