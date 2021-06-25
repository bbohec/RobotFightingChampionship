import { GenericSystem } from '../Generic/GenericSystem'
import { GameEvent } from '../../Events/port/GameEvent'
import { Playable } from '../../Component/Playable'
import { ServerGameEventDispatcherSystem } from '../GameEventDispatcher/ServerGameEventDispatcherSystem'
import { MissingOriginEntityId, MissingTargetEntityId, newEvent } from '../../Events/port/GameEvents'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'

export class MatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.targetEntityId === undefined) throw new Error(MissingTargetEntityId)
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        const players = this.interactWithEntities.retrieveEntityById(gameEvent.targetEntityId).retrieveComponent(Playable).players
        players.push(gameEvent.originEntityId)
        if (this.isMatchHasAllPlayers(players)) return this.onMatchHasAllPlayers(players, gameEvent.targetEntityId)
        return Promise.resolve()
    }

    private onMatchHasAllPlayers (players:string[], matchId:string): Promise<void> {
        return Promise.all([
            ...players.map(player => this.sendEventToDispatcherSystem(newEvent(Action.create, EntityType.tower, undefined, player))),
            ...players.map(player => this.sendEventToDispatcherSystem(newEvent(Action.create, EntityType.robot, undefined, player))),
            this.sendEventToDispatcherSystem(newEvent(Action.create, EntityType.grid, undefined, matchId))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private sendEventToDispatcherSystem (event: GameEvent): Promise<void> {
        return this.interactWithSystems.retrieveSystemByClass(ServerGameEventDispatcherSystem).sendEvent(event)
    }

    private isMatchHasAllPlayers (players: string[]):boolean {
        return players.length === 2
    }
}
