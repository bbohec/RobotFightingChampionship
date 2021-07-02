import { GenericSystem } from '../Generic/GenericSystem'
import { GameEvent } from '../../Events/port/GameEvent'
import { Playable } from '../../Component/Playable'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId, MissingTargetEntityId, newEvent } from '../../Events/port/GameEvents'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { EntityReference } from '../../Component/EntityReference'
import { Match } from '../../Entities/Match/Match'

export class ServerMatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.playerJoinMatch) { return this.onPlayerJoinMatch(gameEvent) }
        if (gameEvent.action === Action.register) { return this.onRegister(gameEvent) }
        throw new Error(errorMessageOnUnknownEventAction(ServerMatchSystem.name, gameEvent))
    }

    private onRegister (gameEvent: GameEvent): Promise<void> {
        if (!gameEvent.targetEntityId) { throw new Error(MissingTargetEntityId) }
        if (!gameEvent.originEntityId) { throw new Error(MissingOriginEntityId) }
        if (gameEvent.originEntityType === EntityType.nothing) { throw new Error(`Entity type ${EntityType.nothing} is not supported.`) }
        const references = this.interactWithEntities.retrieveEntityById(gameEvent.targetEntityId).retrieveComponent(EntityReference).entityReferences
        references.set(gameEvent.originEntityId, gameEvent.originEntityType)
        let robotReferenced = false
        let towerReferenced = false
        for (const value of references.values()) {
            if (value === EntityType.robot) { robotReferenced = true }
            if (value === EntityType.tower) { towerReferenced = true }
        }
        if (robotReferenced && towerReferenced) {
            const playerEntityId = gameEvent.targetEntityId
            const matchEntities = this.interactWithEntities.retrieveEntitiesThatHaveComponent(Match, Playable)
            const matchEntity = matchEntities.find(match => match.retrieveComponent(Playable).players.some(player => player === playerEntityId))
            if (!matchEntity) { throw new Error(`No match with player that have id ${playerEntityId}`) }
            return this.sendEvent(newEvent(Action.ready, EntityType.player, EntityType.match, matchEntity.id, gameEvent.targetEntityId))
        }
        return Promise.resolve()
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

    private onMatchHasAllPlayers (players: string[], matchId: string): Promise<void> {
        return Promise.all([
            ...players.map(player => this.sendEvent(newEvent(Action.create, EntityType.nothing, EntityType.tower, undefined, player))),
            ...players.map(player => this.sendEvent(newEvent(Action.create, EntityType.nothing, EntityType.robot, undefined, player))),
            this.sendEvent(newEvent(Action.create, EntityType.nothing, EntityType.grid, undefined, matchId))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private isMatchHasAllPlayers (players: string[]): boolean {
        return players.length === 2
    }
}
