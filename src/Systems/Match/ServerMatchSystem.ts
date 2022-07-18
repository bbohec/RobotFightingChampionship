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
import { drawEvent } from '../../Events/draw/draw'
import { matchGridDimension } from '../../Components/port/Dimension'
import { Phasing } from '../../Components/Phasing'

export class ServerMatchSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === Action.register
            ? this.onRegister(gameEvent)
            : gameEvent.action === Action.join
                ? this.onJoin(gameEvent, this.interactWithEntities.retrieveyComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), EntityReference))
                : gameEvent.action === Action.quit
                    ? this.onQuit(gameEvent, this.interactWithEntities.retrieveyComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), EntityReference))
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
        this.interactWithEntities.retrieveyComponentByEntityId(gameEvent.entityByEntityType(EntityType.game), EntityReference)
            .entityReferences.set(EntityType.simpleMatchLobby, [gameEvent.entityByEntityType(EntityType.simpleMatchLobby)])
        return Promise.resolve()
    }

    private onQuit (gameEvent: GameEvent, matchEntityReferenceComponent:EntityReference): Promise<void> {
        const quittingPlayerId = gameEvent.entityByEntityType(EntityType.player)
        this.removePlayerFromEntityReferenceComponent(matchEntityReferenceComponent, quittingPlayerId)
        return this.onPlayerRemoved(matchEntityReferenceComponent, quittingPlayerId)
    }

    private onPlayerRemoved (matchEntityReferenceComponent: EntityReference, quittingPlayerId:string): Promise<void> {
        const quittingPlayerEntityReference = this.interactWithEntities.retrieveyComponentByEntityId(quittingPlayerId, EntityReference)
        const remainingPlayers = this.interactWithEntities.retrieveyComponentByEntityId(quittingPlayerEntityReference.retrieveReference(EntityType.match), EntityReference).retrieveReferences(EntityType.player)
        const matchPlayers = [quittingPlayerId, ...remainingPlayers]
        const remainingPlayerEntityReferences = remainingPlayers.map(remainingPlayer => this.interactWithEntities.retrieveyComponentByEntityId(remainingPlayer, EntityReference))
        const quittingPlayerRobotPhysical = this.updateEntityPhysicalComponent(quittingPlayerEntityReference.retrieveReference(EntityType.robot), false)
        const quittingPlayerTowerPhysical = this.updateEntityPhysicalComponent(quittingPlayerEntityReference.retrieveReference(EntityType.tower), false)
        const quittingPlayerRobotPhysicals = remainingPlayerEntityReferences.map(entityReferences => this.updateEntityPhysicalComponent(entityReferences.retrieveReference(EntityType.robot), false))
        const quittingPlayerTowerPhysicals = remainingPlayerEntityReferences.map(entityReferences => this.updateEntityPhysicalComponent(entityReferences.retrieveReference(EntityType.tower), false))
        const gridEntityReference = this.interactWithEntities.retrieveyComponentByEntityId(matchEntityReferenceComponent.retrieveReference(EntityType.grid), EntityReference)
        const cellPhysicals = gridEntityReference.retrieveReferences(EntityType.cell).map(cellId => this.updateEntityPhysicalComponent(cellId, false))
        const events:GameEvent[] = [
            ...matchPlayers.map(playerId => drawEvent(playerId, quittingPlayerRobotPhysical)),
            ...matchPlayers.map(playerId => drawEvent(playerId, quittingPlayerTowerPhysical)),
            ...quittingPlayerRobotPhysicals.map(physical => drawEvent(quittingPlayerId, physical)),
            ...quittingPlayerTowerPhysicals.map(physical => drawEvent(quittingPlayerId, physical)),
            ...cellPhysicals.map(physical => drawEvent(quittingPlayerId, physical)),
            drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(quittingPlayerEntityReference.retrieveReference(EntityType.nextTurnButton), false)),
            drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(quittingPlayerEntityReference.retrieveReference(EntityType.mainMenu), true)),
            drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(quittingPlayerEntityReference.retrieveReference(EntityType.button), true)),
            this.drawVictoryOrDefeatEvent(quittingPlayerId, matchEntityReferenceComponent),
            destroyRobotEvent(quittingPlayerRobotPhysical.entityId),
            destroyTowerEvent(quittingPlayerTowerPhysical.entityId)
        ]
        if (!matchEntityReferenceComponent.hasReferences(EntityType.player)) events.push(destroyMatchEvent(matchEntityReferenceComponent.entityId))
        return this.sendEvents(events)
    }

    drawVictoryOrDefeatEvent (quittingPlayerId: string, matchEntityReference:EntityReference): GameEvent {
        return quittingPlayerId === this.interactWithEntities.retrieveyComponentByEntityId(matchEntityReference.entityId, Phasing).currentPhase.currentPlayerId
            ? drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(matchEntityReference.retrieveReference(EntityType.victory), false))
            : drawEvent(quittingPlayerId, this.updateEntityPhysicalComponent(matchEntityReference.retrieveReference(EntityType.defeat), false))
    }

    private updateEntityPhysicalComponent (entityId:string, visible:boolean):Physical {
        const entityPhysicalComponent = this.interactWithEntities.retrieveyComponentByEntityId(entityId, Physical)
        entityPhysicalComponent.visible = visible
        return entityPhysicalComponent
    }

    private removePlayerFromEntityReferenceComponent (entityReferenceComponent: EntityReference, quitingPlayerId: string) {
        const players = entityReferenceComponent.retrieveReferences(EntityType.player)
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
            entityReferenceComponent.hasReferences(EntityType.robot) &&
            entityReferenceComponent.hasReferences(EntityType.tower) &&
            entityReferenceComponent.hasReferences(EntityType.nextTurnButton)
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
