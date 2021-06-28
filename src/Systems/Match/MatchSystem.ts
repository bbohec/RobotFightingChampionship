import { GenericSystem } from '../Generic/GenericSystem'
import { GameEvent } from '../../Events/port/GameEvent'
import { Playable } from '../../Component/Playable'
import { ServerGameEventDispatcherSystem } from '../GameEventDispatcher/ServerGameEventDispatcherSystem'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId, MissingTargetEntityId, newEvent } from '../../Events/port/GameEvents'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
// import { GridReference } from '../../Component/GridReference'
// import { TowerReference } from '../../Component/TowerReference'
import { EntityReference } from '../../Component/EntityReference'

export class MatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.playerJoinMatch) return this.onPlayerJoinMatch(gameEvent)
        if (gameEvent.action === Action.register) return this.onRegister(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(MatchSystem.name, gameEvent))
    }

    private onRegister (gameEvent: GameEvent): Promise<void> {
        if (!gameEvent.targetEntityId) throw new Error(MissingTargetEntityId)
        if (!gameEvent.originEntityId) throw new Error(MissingOriginEntityId)
        if (gameEvent.originEntityType === EntityType.nothing) throw new Error(`Entity type ${EntityType.nothing} is not supported.`)
        this.interactWithEntities.retrieveEntityById(gameEvent.targetEntityId).retrieveComponent(EntityReference).entityReferences.set(gameEvent.originEntityId, gameEvent.originEntityType)
        return Promise.resolve()
    }

    private onPlayerJoinMatch (gameEvent:GameEvent):Promise<void> {
        if (gameEvent.targetEntityId === undefined) throw new Error(MissingTargetEntityId)
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        const players = this.interactWithEntities.retrieveEntityById(gameEvent.targetEntityId).retrieveComponent(Playable).players
        players.push(gameEvent.originEntityId)
        return (this.isMatchHasAllPlayers(players))
            ? this.onMatchHasAllPlayers(players, gameEvent.targetEntityId)
            : Promise.resolve()
    }

    private onMatchHasAllPlayers (players:string[], matchId:string): Promise<void> {
        return Promise.all([
            ...players.map(player => this.sendEventToDispatcherSystem(newEvent(Action.create, EntityType.nothing, EntityType.tower, undefined, player))),
            ...players.map(player => this.sendEventToDispatcherSystem(newEvent(Action.create, EntityType.nothing, EntityType.robot, undefined, player))),
            this.sendEventToDispatcherSystem(newEvent(Action.create, EntityType.nothing, EntityType.grid, undefined, matchId))
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
