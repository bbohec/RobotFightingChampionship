import { GenericSystem } from '../Generic/GenericSystem'
import { GameEvent } from '../../Events/port/GameEvent'
import { Playable } from '../../Component/Playable'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId, MissingTargetEntityId } from '../../Events/port/GameEvents'
import { Action } from '../../Events/port/Action'
import { EntityType, unsupportedEntityTypeMessage } from '../../Events/port/EntityType'
import { EntityReference } from '../../Component/EntityReference'
import { Match } from '../../Entities/Match'
import { playerReadyForMatch } from '../../Events/ready/ready'
import { createGridEvent, createRobotEvent, createTowerEvent } from '../../Events/create/create'

export class ServerMatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.join) { return this.onPlayerJoinMatch(gameEvent) }
        if (gameEvent.action === Action.register) { return this.onRegister(gameEvent) }
        throw new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent))
    }

    private onRegister (gameEvent: GameEvent): Promise<void> {
        if (!gameEvent.targetEntityId) throw new Error(MissingTargetEntityId)
        if (!gameEvent.originEntityId) throw new Error(MissingOriginEntityId)
        if (gameEvent.originEntityType === EntityType.nothing) throw new Error(unsupportedEntityTypeMessage(EntityType.nothing))
        const references = this.interactWithEntities.retrieveEntityById(gameEvent.targetEntityId).retrieveComponent(EntityReference).entityReferences
        references.set(gameEvent.originEntityId, gameEvent.originEntityType)
        let robotReferenced = false
        let towerReferenced = false
        for (const value of references.values()) {
            if (value === EntityType.robot) robotReferenced = true
            if (value === EntityType.tower) towerReferenced = true
        }
        return (robotReferenced && towerReferenced) ? this.onRobotAndTowerReferenced(gameEvent) : Promise.resolve()
    }

    private onRobotAndTowerReferenced (gameEvent:GameEvent) {
        if (!gameEvent.targetEntityId) throw new Error(MissingTargetEntityId)
        const matchEntities = this.interactWithEntities.retrieveEntitiesThatHaveComponent(Match, Playable)
        const matchEntity = matchEntities.find(match => match.retrieveComponent(Playable).players.some(player => player === gameEvent.targetEntityId))
        if (matchEntity) return this.sendEvent(playerReadyForMatch(matchEntity.id, gameEvent.targetEntityId))
        throw new Error(`No match with player that have id ${gameEvent.targetEntityId}`)
    }

    private onPlayerJoinMatch (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.targetEntityId === undefined) { throw new Error(MissingTargetEntityId) }
        if (gameEvent.originEntityId === undefined) { throw new Error(MissingOriginEntityId) }
        const players = this.interactWithEntities.retrieveEntityById(gameEvent.targetEntityId).retrieveComponent(Playable).players
        players.push(gameEvent.originEntityId)
        return (this.isMatchHasAllPlayers(players))
            ? this.onMatchHasAllPlayers(players, gameEvent.targetEntityId)
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
