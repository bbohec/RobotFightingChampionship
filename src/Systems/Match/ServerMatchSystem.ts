import { GenericSystem } from '../Generic/GenericSystem'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { Playable } from '../../Components/Playable'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { EntityReference } from '../../Components/EntityReference'
import { playerReadyForMatch } from '../../Events/ready/ready'
import { createGridEvent, createRobotEvent, createTowerEvent } from '../../Events/create/create'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../../Events/destroy/destroy'
import { mainMenuEntityId } from '../../Event/entityIds'
import { showEvent } from '../../Events/show/show'
import { playerNotFoundOnMatchPlayers } from './port/matchSystem'

export class ServerMatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.join) return this.onJoin(gameEvent)
        if (gameEvent.action === Action.register) return this.onRegister(gameEvent)
        if (gameEvent.action === Action.quit) return this.onQuit(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent))
    }

    private onRegister (gameEvent:GameEvent):Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.grid)) return this.onRegisterGridOnMatch(gameEvent, this.entityReferencesByEntityId(gameEvent.entityByEntityType(EntityType.match)))
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const playerEntityReference = this.entityReferencesByEntityId(playerId)
        if (gameEvent.hasEntitiesByEntityType(EntityType.robot)) return this.onRegisterRobotOnPlayer(gameEvent, playerId, playerEntityReference)
        if (gameEvent.hasEntitiesByEntityType(EntityType.tower)) return this.onRegisterTowerOnPlayer(gameEvent, playerId, playerEntityReference)
        throw new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent))
    }

    private onQuit (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const playableComponent = this.interactWithEntities.retrieveEntityById(gameEvent.entityByEntityType(EntityType.match)).retrieveComponent(Playable)
        this.removePlayerFromPlayableComponent(playableComponent, playerId)
        return this.onPlayerRemoved(playableComponent, playerId)
    }

    private onPlayerRemoved (playableComponent: Playable, playerId:string): Promise<void> {
        const playerEntityReference = this.entityReferencesByEntityId(playerId)
        const events:GameEvent[] = [
            destroyRobotEvent(playerEntityReference.retreiveReference(EntityType.robot)),
            destroyTowerEvent(playerEntityReference.retreiveReference(EntityType.tower)),
            showEvent(EntityType.mainMenu, mainMenuEntityId, playerId)
        ]
        if (playableComponent.players.length === 0) events.push(destroyMatchEvent(playableComponent.entityId))
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private removePlayerFromPlayableComponent (playableComponent: Playable, quitingPlayerId: string) {
        const playerIndex = playableComponent.players.findIndex(playerId => playerId === quitingPlayerId)
        if (playerIndex < 0) { throw new Error(playerNotFoundOnMatchPlayers(quitingPlayerId)) }
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

    private onJoin (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        const players = this.interactWithEntities.retrieveEntityById(matchId).retrieveComponent(Playable).players
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
        return players.length === 2
    }
}
