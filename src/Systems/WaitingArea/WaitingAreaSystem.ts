import { Playable } from '../../Component/Playable'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby/SimpleMatchLobby'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { GameEvent } from '../../Events/port/GameEvent'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId, newEvent } from '../../Events/port/GameEvents'
import { GenericSystem } from '../Generic/GenericSystem'

export class WaitingAreaSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.targetEntityType === 'Simple Match Lobby') return this.onSimpleMatchLobbyTarget(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(WaitingAreaSystem.name, gameEvent))
    }

    private onSimpleMatchLobbyTarget (gameEvent:GameEvent):Promise<void> {
        const players = this.interactWithEntities.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players
        if (gameEvent.action === 'Waiting for players') return this.twoPlayersOnWaitingAreaJoinMatch(gameEvent, players)
        this.addPlayerOnWaitingArea(players, gameEvent)
        return this.createMatchForEachTwoPlayers(players)
    }

    private twoPlayersOnWaitingAreaJoinMatch (gameEvent: GameEvent, players: string[]):Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        const matchId = gameEvent.originEntityId
        if (players.length < 2) return Promise.resolve()
        const playersToJoinMatch = [players.shift()!, players.shift()!]
        return Promise.all(playersToJoinMatch.map(player => this.sendEvent(
            newEvent(Action.playerJoinMatch, EntityType.nothing, EntityType.match, matchId, player))))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private addPlayerOnWaitingArea (players: string[], gameEvent: GameEvent):void {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        players.push(gameEvent.originEntityId)
    }

    private createMatchForEachTwoPlayers (players: string[]): Promise<void> {
        return (players.length % 2 === 0)
            ? this.sendEvent(newEvent(Action.create, EntityType.nothing, EntityType.match))
            : Promise.resolve()
    }
}
