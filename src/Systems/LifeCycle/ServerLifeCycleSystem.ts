import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
import { createSimpleMatchLobbyEvent } from '../../Events/create/create'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby'
import { Match } from '../../Entities/Match'
import { Playable } from '../../Components/Playable'
import { Grid } from '../../Entities/Grid'
import { Dimensional } from '../../Components/Dimensional'
import { EntityType } from '../../Event/EntityType'
import { Tower } from '../../Entities/Tower'
import { Robot } from '../../Entities/Robot'
import { Player } from '../../Entities/Player'
import { EntityReference } from '../../Components/EntityReference'
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
import { Game } from '../../Entities/Game'
import { registerGridEvent, registerRobotEvent, registerTowerEvent } from '../../Events/register/register'
import { matchWaitingForPlayers } from '../../Events/waiting/waiting'
import { Hittable } from '../../Components/Hittable'
import { Offensive } from '../../Components/Offensive'
import { Action } from '../../Event/Action'
export class ServerLifeCycleSystem extends GenericLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.destroy) return this.onDestroyEvent(gameEvent)
        if (gameEvent.action === Action.create) return this.onCreateEvent(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ServerLifeCycleSystem.name, gameEvent))
    }

    private onCreateEvent (gameEvent: GameEvent): Promise<void> {
        const strategy = this.retrieveCreateStrategy(gameEvent)
        if (strategy) return strategy()
        throw new Error(errorMessageOnUnknownEventAction(ServerLifeCycleSystem.name, gameEvent))
    }

    private onDestroyEvent (gameEvent: GameEvent): Promise<void> {
        for (const entity of gameEvent.allEntities()) this.interactWithEntities.deleteEntityById(entity)
        return Promise.resolve()
    }

    private retrieveCreateStrategy (gameEvent:GameEvent):(()=>Promise<void>) | undefined {
        const allEntityTypes = gameEvent.allEntityTypes()
        return (allEntityTypes.includes(EntityType.tower) && allEntityTypes.includes(EntityType.player))
            ? () => this.createTowerEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
            : (allEntityTypes.includes(EntityType.robot))
                ? () => this.createRobotEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                : (allEntityTypes.includes(EntityType.player))
                    ? () => this.createPlayerEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                    : (allEntityTypes.includes(EntityType.grid))
                        ? () => this.createGridEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                        : (allEntityTypes.includes(EntityType.match))
                            ? () => this.createMatchEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent.entityByEntityType(EntityType.simpleMatchLobby))
                            : (allEntityTypes.includes(EntityType.simpleMatchLobby))
                                ? () => this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier())
                                : (allEntityTypes.includes(EntityType.game))
                                    ? () => this.createGameEntity(this.interactWithIdentiers.nextIdentifier())
                                    : undefined
    }

    private createPlayerEntity (playerEntityId: string, gameEvent: GameEvent): Promise<void> {
        return this.createEntity(
            new Player(playerEntityId),
            [new EntityReference(playerEntityId, new Map())],
            undefined
        )
    }

    private createRobotEntity (robotEntityId:string, gameEvent:GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        return this.createEntity(
            new Robot(robotEntityId),
            [
                new Hittable(robotEntityId, 50),
                new Offensive(robotEntityId, 20),
                new EntityReference(robotEntityId, new Map([
                    [EntityType.player, [playerId]]
                ]))
            ],
            registerRobotEvent(robotEntityId, playerId)
        )
    }

    private createGameEntity (gameEntityId: string): Promise<void> {
        return this.createEntity(
            new Game(gameEntityId),
            [],
            createSimpleMatchLobbyEvent(gameEntityId, 'create')
        )
    }

    private createSimpleMatchLobbyEntity (simpleMatchLobbyEntityId: string): Promise<void> {
        return this.createEntity(
            new SimpleMatchLobby(simpleMatchLobbyEntityId),
            [new Playable(simpleMatchLobbyEntityId, [])]
        )
    }

    private createMatchEntity (matchEntityId: string, simpleMatchLobbyEntityId:string): Promise<void> {
        return this.createEntity(
            new Match(matchEntityId),
            [new Playable(matchEntityId, []), new EntityReference(matchEntityId, new Map()), new Phasing(matchEntityId, preparingGamePhase())],
            matchWaitingForPlayers(matchEntityId, simpleMatchLobbyEntityId)
        )
    }

    private createGridEntity (gridEntityId: string, gameEvent: GameEvent): Promise<void> {
        return this.createEntity(
            new Grid(gridEntityId),
            [new Dimensional(gridEntityId, { x: 25, y: 25 })],
            registerGridEvent(gameEvent.entityByEntityType(EntityType.match), gridEntityId)
        )
    }

    private createTowerEntity (towerEntityId:string, gameEvent:GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        return this.createEntity(
            new Tower(towerEntityId),
            [
                new Hittable(towerEntityId, 100),
                new Offensive(towerEntityId, 5),
                new EntityReference(towerEntityId, new Map([
                    [EntityType.player, [playerId]]
                ]))
            ],
            registerTowerEvent(towerEntityId, playerId)
        )
    }
}
