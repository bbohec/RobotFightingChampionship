import { GameEvent } from '../../Events/port/GameEvent'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId, newEvent } from '../../Events/port/GameEvents'
import { ServerGame } from '../../Entities/ServerGame/ServerGame'
import { ServerGameEventDispatcherSystem } from '../GameEventDispatcher/ServerGameEventDispatcherSystem'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby/SimpleMatchLobby'
import { Match } from '../../Entities/Match/Match'
import { Playable } from '../../Component/Playable'
import { Grid } from '../../Entities/Grid/Grid'
import { Dimensional } from '../../Component/Dimensional'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { Tower } from '../../Entities/Tower/Tower'
import { Robot } from '../../Entities/Robot/Robot'
export class ServerLifeCycleSystem extends GenericLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const strategy = this.retrieveStrategy(gameEvent)
        if (!strategy) throw new Error(errorMessageOnUnknownEventAction(ServerLifeCycleSystem.name, gameEvent))
        return strategy()
    }

    private retrieveStrategy (gameEvent:GameEvent):(()=>Promise<void>) | undefined {
        const strategies = new Map([
            [EntityType.serverGame, () => this.createServerGameEntity(this.interactWithIdentiers.nextIdentifier())],
            [EntityType.simpleMatchLobby, () => this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier())],
            [EntityType.match, () => this.createMatchEntity(this.interactWithIdentiers.nextIdentifier())],
            [EntityType.grid, () => this.createGridEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)],
            [EntityType.tower, () => this.createTowerEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)],
            [EntityType.robot, () => this.createEntity(new Robot(this.interactWithIdentiers.nextIdentifier()))]
        ])
        return strategies.get(gameEvent.targetEntityType)
    }

    protected sendOptionnalNextEvent (nextEvent?: GameEvent | GameEvent[]): Promise<void> {
        return (nextEvent === undefined)
            ? Promise.resolve()
            : (!Array.isArray(nextEvent))
                ? this.interactWithSystems.retrieveSystemByClass(ServerGameEventDispatcherSystem).sendEvent(nextEvent)
                : this.sendNextEvents(nextEvent)
    }

    private createServerGameEntity (serverGameEntityId: string): Promise<void> {
        return this.createEntity(
            new ServerGame(serverGameEntityId),
            [],
            newEvent(Action.create, EntityType.simpleMatchLobby)
        )
    }

    private createSimpleMatchLobbyEntity (simpleMatchLobbyEntityId: string): Promise<void> {
        return this.createEntity(
            new SimpleMatchLobby(simpleMatchLobbyEntityId),
            [new Playable(simpleMatchLobbyEntityId)]
        )
    }

    private createMatchEntity (matchEntityId: string): Promise<void> {
        return this.createEntity(
            new Match(matchEntityId),
            [new Playable(matchEntityId)],
            newEvent(Action.waitingForPlayers, EntityType.simpleMatchLobby, undefined, matchEntityId)
        )
    }

    private createGridEntity (gridEntityId: string, gameEvent: GameEvent): Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        return this.createEntity(
            new Grid(gridEntityId),
            [new Dimensional(gridEntityId, { x: 25, y: 25 })],
            newEvent(Action.register, EntityType.match, gameEvent.originEntityId, gridEntityId)
        )
    }

    private createTowerEntity (towerEntityId:string, gameEvent:GameEvent): Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        return this.createEntity(
            new Tower(towerEntityId),
            [],
            newEvent(Action.register, EntityType.player, gameEvent.originEntityId, towerEntityId)
        )
    }
}
