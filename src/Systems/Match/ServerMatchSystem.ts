import { GenericSystem } from '../Generic/GenericSystem'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { Playable } from '../../Components/Playable'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { EntityReference } from '../../Components/EntityReference'
import { Match } from '../../Entities/Match'
import { playerReadyForMatch } from '../../Events/ready/ready'
import { createGridEvent, createRobotEvent, createTowerEvent } from '../../Events/create/create'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../../Events/destroy/destroy'
import { mainMenuEntityId } from '../../Event/entityIds'
import { showEvent } from '../../Events/show/show'

export class ServerMatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.join) return this.onPlayerJoinMatch(gameEvent)
        if (gameEvent.action === Action.register && gameEvent.hasEntitiesByEntityType(EntityType.grid)) return this.onRegisterGridOnMatch(gameEvent)
        if (gameEvent.action === Action.register && gameEvent.hasEntitiesByEntityType(EntityType.robot)) return this.onRegisterRobotOnPlayer(gameEvent)
        if (gameEvent.action === Action.register && gameEvent.hasEntitiesByEntityType(EntityType.tower)) return this.onRegisterTowerOnPlayer(gameEvent)
        if (gameEvent.action === Action.quit) return this.onQuitMatch(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent))
    }

    private onQuitMatch (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const playableComponent = this.interactWithEntities.retrieveEntityById(gameEvent.entityByEntityType(EntityType.match)).retrieveComponent(Playable)
        this.removePlayerFromPlayableComponent(playableComponent, playerId)
        return this.onPlayerRemoved(playableComponent, playerId)
    }

    private onPlayerRemoved (playableComponent: Playable, playerId:string): Promise<void> {
        const entityReference = this.interactWithEntities.retrieveEntityById(playerId).retrieveComponent(EntityReference)
        const robotIds = entityReference.entityReferences.get(EntityType.robot)
        const towerIds = entityReference.entityReferences.get(EntityType.tower)
        if (!robotIds) throw new Error('Robot entity Id missing on player entity reference component.')
        if (!towerIds) throw new Error('Tower entity Id missing on player entity reference component.')
        if (robotIds.length !== 1) throw new Error('There is not one Robot id on robot references.')
        if (towerIds.length !== 1) throw new Error('There is not one Tower id on robot references.')
        const events:GameEvent[] = [
            destroyRobotEvent(robotIds[0]),
            destroyTowerEvent(towerIds[0]),
            showEvent(EntityType.mainMenu, mainMenuEntityId, playerId)
        ]
        if (playableComponent.players.length === 0) events.push(destroyMatchEvent(playableComponent.entityId))
        return Promise.all(events.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private removePlayerFromPlayableComponent (playableComponent: Playable, quitingPlayerId: string) {
        const playerIndex = playableComponent.players.findIndex(playerId => playerId === quitingPlayerId)
        if (playerIndex < 0) { throw new Error(`Player with Id '${quitingPlayerId}' not found on match players.`) }
        playableComponent.players.splice(playerIndex, 1)
    }

    onRegisterTowerOnPlayer (gameEvent: GameEvent): Promise<void> {
        const entityReferenceComponent = this.addEntityReference(
            this.interactWithEntities.retrieveEntityById(gameEvent.entityByEntityType(EntityType.player)).retrieveComponent(EntityReference),
            gameEvent,
            EntityType.tower
        )
        return (this.isRobotAndTowerReferenced(entityReferenceComponent)) ? this.onRobotAndTowerReferenced(gameEvent) : Promise.resolve()
    }

    onRegisterRobotOnPlayer (gameEvent: GameEvent): Promise<void> {
        const entityReferenceComponent = this.addEntityReference(
            this.interactWithEntities.retrieveEntityById(gameEvent.entityByEntityType(EntityType.player)).retrieveComponent(EntityReference),
            gameEvent,
            EntityType.robot
        )
        return (this.isRobotAndTowerReferenced(entityReferenceComponent)) ? this.onRobotAndTowerReferenced(gameEvent) : Promise.resolve()
    }

    private isRobotAndTowerReferenced (entityReferenceComponent:EntityReference):Boolean {
        /*
        let robotReferenced = false
        let towerReferenced = false
        for (const value of entityReferenceComponent.entityReferences.values()) {
            if (value === EntityType.robot) robotReferenced = true
            if (value === EntityType.tower) towerReferenced = true
        }
        return (robotReferenced && towerReferenced)
        */
        return (
            entityReferenceComponent.entityReferences.has(EntityType.robot) &&
            entityReferenceComponent.entityReferences.has(EntityType.tower)
        )
    }

    private addEntityReference (referenceComponent:EntityReference, event:GameEvent, entityType:EntityType):EntityReference {
        referenceComponent.entityReferences.set(entityType, [event.entityByEntityType(entityType)])
        return referenceComponent
    }

    private onRegisterGridOnMatch (gameEvent: GameEvent): Promise<void> {
        this.addEntityReference(
            this.interactWithEntities.retrieveEntityById(gameEvent.entityByEntityType(EntityType.match)).retrieveComponent(EntityReference),
            gameEvent,
            EntityType.grid
        )
        return Promise.resolve()
    }

    private onRobotAndTowerReferenced (gameEvent:GameEvent) {
        const matchEntities = this.interactWithEntities.retrieveEntitiesThatHaveComponent(Match, Playable)
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const matchEntity = matchEntities.find(match => match.retrieveComponent(Playable).players.some(player => player === playerId))
        if (matchEntity) return this.sendEvent(playerReadyForMatch(matchEntity.id, playerId))
        throw new Error(`No match with player that have id ${playerId}`)
    }

    private onPlayerJoinMatch (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        const players = this.interactWithEntities.retrieveEntityById(matchId).retrieveComponent(Playable).players
        players.push(playerId)
        this.interactWithEntities.retrieveEntityById(playerId).retrieveComponent(EntityReference).entityReferences.set(EntityType.match, [matchId])
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
