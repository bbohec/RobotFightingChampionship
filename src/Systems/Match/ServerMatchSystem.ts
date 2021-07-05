import { GenericSystem } from '../Generic/GenericSystem'
import { GameEvent } from '../../Events/port/GameEvent'
import { Playable } from '../../Component/Playable'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId, MissingTargetEntityId, newEvent } from '../../Events/port/GameEvents'
import { Action } from '../../Events/port/Action'
import { EntityType, unsupportedEntityTypeMessage } from '../../Events/port/EntityType'
import { EntityReference } from '../../Component/EntityReference'
import { Match } from '../../Entities/Match/Match'
import { playerReadyForMatch } from '../Phasing/PhasingSystem'

export const matchWaitingForPlayers = (matchId:string):GameEvent => newEvent(Action.waitingForPlayers, EntityType.nothing, EntityType.simpleMatchLobby, undefined, matchId)
export const registerGridEvent = (matchId:string, gridId:string) => newEvent(Action.register, EntityType.grid, EntityType.match, matchId, gridId)
export const registerTowerEvent = (towerId:string, playerId:string) => newEvent(Action.register, EntityType.tower, EntityType.player, playerId, towerId)
export const registerRobotEvent = (robotId:string, playerId:string) => newEvent(Action.register, EntityType.robot, EntityType.player, playerId, robotId)
export const playerJoinMatchEvent = (player:string, matchId:string) => newEvent(Action.playerJoinMatch, EntityType.nothing, EntityType.match, matchId, player)

export class ServerMatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.playerJoinMatch) { return this.onPlayerJoinMatch(gameEvent) }
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
