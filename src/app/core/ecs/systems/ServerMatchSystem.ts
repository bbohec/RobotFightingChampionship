import { matchGridDimension } from '../components/Dimensional'
import { EntityReference, hasReferences, linkEntityToEntities, retrieveReference, retrieveReferences } from '../components/EntityReference'
import { maxPlayerPerMatch } from '../components/Phasing'
import { Physical } from '../components/Physical'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { createGridEvent, createPlayerNextTurnMatchButtonEvent, createRobotEvent, createTowerEvent } from '../../events/create/create'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../../events/destroy/destroy'
import { drawEvent } from '../../events/draw/draw'
import { playerReadyForMatch } from '../../events/ready/ready'
import { playerNotFoundOnMatchPlayers } from '../../../messages'
import { GenericServerSystem } from '../system'

export class ServerMatchSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === Action.register
            ? this.onRegister(gameEvent)
            : gameEvent.action === Action.join
                ? this.onJoin(gameEvent, this.componentRepository.retrieveComponent(this.entityByEntityType(gameEvent, EntityType.match), 'EntityReference'))
                : gameEvent.action === Action.quit
                    ? this.onQuit(gameEvent, this.componentRepository.retrieveComponent(this.entityByEntityType(gameEvent, EntityType.match), 'EntityReference'))
                    : Promise.reject(new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent)))
    }

    private onRegister (gameEvent:GameEvent):Promise<void> {
        return this.hasEntitiesByEntityType(gameEvent, EntityType.game)
            ? this.onRegisterSimpleMatchLobbyOnGame(gameEvent)
            : this.hasEntitiesByEntityType(gameEvent, EntityType.robot)
                ? this.onRegisterEntityOnPlayer(gameEvent, this.entityReferencesByEntityId(this.entityByEntityType(gameEvent, EntityType.player)), EntityType.robot)
                : this.hasEntitiesByEntityType(gameEvent, EntityType.tower)
                    ? this.onRegisterEntityOnPlayer(gameEvent, this.entityReferencesByEntityId(this.entityByEntityType(gameEvent, EntityType.player)), EntityType.tower)
                    : this.hasEntitiesByEntityType(gameEvent, EntityType.nextTurnButton)
                        ? this.onRegisterEntityOnPlayer(gameEvent, this.entityReferencesByEntityId(this.entityByEntityType(gameEvent, EntityType.player)), EntityType.nextTurnButton)
                        : Promise.reject(new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent)))
    }

    private onRegisterSimpleMatchLobbyOnGame (gameEvent: GameEvent): Promise<void> {
        this.componentRepository.retrieveComponent(this.entityByEntityType(gameEvent, EntityType.game), 'EntityReference')
            .entityReferences.set(EntityType.simpleMatchLobby, [this.entityByEntityType(gameEvent, EntityType.simpleMatchLobby)])
        return Promise.resolve()
    }

    private onQuit (gameEvent: GameEvent, matchEntityReferenceComponent:EntityReference): Promise<void> {
        const quittingPlayerId = this.entityByEntityType(gameEvent, EntityType.player)
        this.removePlayerFromEntityReferenceComponent(matchEntityReferenceComponent, quittingPlayerId)
        return this.onPlayerRemoved(matchEntityReferenceComponent, quittingPlayerId)
    }

    private onPlayerRemoved (matchEntityReferenceComponent: EntityReference, quittingPlayerId:string): Promise<void> {
        const quittingPlayerEntityReference = this.componentRepository.retrieveComponent(quittingPlayerId, 'EntityReference')
        const remainingPlayers = retrieveReferences(this.componentRepository.retrieveComponent(retrieveReference(quittingPlayerEntityReference, EntityType.match), 'EntityReference'), EntityType.player)
        const matchPlayers = [quittingPlayerId, ...remainingPlayers]
        const remainingPlayerEntityReferences = remainingPlayers.map(remainingPlayer => this.componentRepository.retrieveComponent(remainingPlayer, 'EntityReference'))
        const quittingPlayerRobotPhysical = this.updateEntityPhysicalComponent(retrieveReference(quittingPlayerEntityReference, EntityType.robot), false)
        const quittingPlayerTowerPhysical = this.updateEntityPhysicalComponent(retrieveReference(quittingPlayerEntityReference, EntityType.tower), false)
        const quittingPlayerRobotPhysicals = remainingPlayerEntityReferences.map(entityReferences => this.updateEntityPhysicalComponent(retrieveReference(entityReferences, EntityType.robot), false))
        const quittingPlayerTowerPhysicals = remainingPlayerEntityReferences.map(entityReferences => this.updateEntityPhysicalComponent(retrieveReference(entityReferences, EntityType.tower), false))
        const gridEntityReference = this.componentRepository.retrieveComponent(retrieveReference(matchEntityReferenceComponent, EntityType.grid), 'EntityReference')
        const cellPhysicals = retrieveReferences(gridEntityReference, EntityType.cell).map(cellId => this.updateEntityPhysicalComponent(cellId, false))
        const events:GameEvent[] = [
            ...matchPlayers.map(playerId => drawEvent(playerId, quittingPlayerRobotPhysical)),
            ...matchPlayers.map(playerId => drawEvent(playerId, quittingPlayerTowerPhysical)),
            ...quittingPlayerRobotPhysicals.map(physical => drawEvent(quittingPlayerId, physical)),
            ...quittingPlayerTowerPhysicals.map(physical => drawEvent(quittingPlayerId, physical)),
            ...cellPhysicals.map(physical => drawEvent(quittingPlayerId, physical)),
            drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(retrieveReference(quittingPlayerEntityReference, EntityType.nextTurnButton), false)),
            drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(retrieveReference(quittingPlayerEntityReference, EntityType.mainMenu), true)),
            drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(retrieveReference(quittingPlayerEntityReference, EntityType.button), true)),
            this.drawVictoryOrDefeatEvent(quittingPlayerId, matchEntityReferenceComponent),
            destroyRobotEvent(quittingPlayerRobotPhysical.entityId),
            destroyTowerEvent(quittingPlayerTowerPhysical.entityId)
        ]
        if (!hasReferences(matchEntityReferenceComponent, EntityType.player)) events.push(destroyMatchEvent(matchEntityReferenceComponent.entityId))
        return this.sendEvents(events)
    }

    drawVictoryOrDefeatEvent (quittingPlayerId: string, matchEntityReference:EntityReference): GameEvent {
        return quittingPlayerId === this.componentRepository.retrieveComponent(matchEntityReference.entityId, 'Phasing').currentPhase.currentPlayerId
            ? drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(retrieveReference(matchEntityReference, EntityType.victory), false))
            : drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(retrieveReference(matchEntityReference, EntityType.defeat), false))
    }

    private updateEntityPhysicalComponent (entityId:string, visible:boolean):Physical {
        const entityPhysicalComponent:Physical = {
            ...this.componentRepository.retrieveComponent(entityId, 'Physical'),
            visible
        }
        return entityPhysicalComponent
    }

    private removePlayerFromEntityReferenceComponent (entityReferenceComponent: EntityReference, quitingPlayerId: string) {
        const players = retrieveReferences(entityReferenceComponent, EntityType.player)
        const playerIndex = players.findIndex(playerId => playerId === quitingPlayerId)
        if (playerIndex < 0) throw new Error(playerNotFoundOnMatchPlayers(quitingPlayerId))
        players.splice(playerIndex, 1)
        entityReferenceComponent.entityReferences.set(EntityType.player, players)
    }

    private onRegisterEntityOnPlayer (gameEvent: GameEvent, playerEntityReference: EntityReference, entityType: EntityType): Promise<void> {
        linkEntityToEntities(this.componentRepository, this.entityByEntityType(gameEvent, entityType), [playerEntityReference.entityId])
        if (entityType === EntityType.nextTurnButton) linkEntityToEntities(this.componentRepository, this.entityByEntityType(gameEvent, entityType), [this.entityByEntityType(gameEvent, EntityType.match)])
        return (hasReferences(playerEntityReference, EntityType.robot) &&
            hasReferences(playerEntityReference, EntityType.tower) &&
            hasReferences(playerEntityReference, EntityType.nextTurnButton))
            ? this.onPlayerReadyForMatch(playerEntityReference.entityId, retrieveReference(playerEntityReference, EntityType.match))
            : Promise.resolve()
    }

    private onPlayerReadyForMatch (playerId:string, matchId:string) {
        return this.sendEvent(playerReadyForMatch(matchId, playerId))
    }

    private onJoin (gameEvent: GameEvent, matchEntityReference:EntityReference): Promise<void> {
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        const matchId = this.entityByEntityType(gameEvent, EntityType.match)
        if (!hasReferences(matchEntityReference, EntityType.player)) matchEntityReference.entityReferences.set(EntityType.player, [])
        const players = retrieveReferences(matchEntityReference, EntityType.player)
        players.push(playerId)
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
