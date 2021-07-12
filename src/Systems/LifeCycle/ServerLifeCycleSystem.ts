import { GameEvent } from '../../Events/port/GameEvent'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId } from '../../Events/port/GameEvents'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
import { createSimpleMatchLobbyEvent } from '../../Events/create/create'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby'
import { Match } from '../../Entities/Match'
import { Playable } from '../../Component/Playable'
import { Grid } from '../../Entities/Grid'
import { Dimensional } from '../../Component/Dimensional'
import { EntityType } from '../../Events/port/EntityType'
import { Tower } from '../../Entities/Tower'
import { Robot } from '../../Entities/Robot'
import { Player } from '../../Entities/Player'
import { EntityReference } from '../../Component/EntityReference'
import { Phasing } from '../../Component/Phasing'
import { Game } from '../../Entities/Game'
import { PhaseType } from '../../Component/port/Phase'
import { registerGridEvent, registerRobotEvent, registerTowerEvent } from '../../Events/register/register'
import { matchWaitingForPlayers } from '../../Events/waiting/wainting'
import { Hittable } from '../../Component/Hittable'
import { Offensive } from '../Hit/HitSystem'
export class ServerLifeCycleSystem extends GenericLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const strategy = this.retrieveStrategy(gameEvent)
        if (!strategy) throw new Error(errorMessageOnUnknownEventAction(ServerLifeCycleSystem.name, gameEvent))
        return strategy()
    }

    private retrieveStrategy (gameEvent:GameEvent):(()=>Promise<void>) | undefined {
        const strategies = new Map([
            [EntityType.game, () => this.createGameEntity(this.interactWithIdentiers.nextIdentifier())],
            [EntityType.simpleMatchLobby, () => this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier())],
            [EntityType.match, () => this.createMatchEntity(this.interactWithIdentiers.nextIdentifier())],
            [EntityType.grid, () => this.createGridEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)],
            [EntityType.tower, () => this.createTowerEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)],
            [EntityType.player, () => this.createPlayerEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)],
            [EntityType.robot, () => this.createRobotEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)]
        ])
        return strategies.get(gameEvent.targetEntityType)
    }

    private createPlayerEntity (playerEntityId: string, gameEvent: GameEvent): Promise<void> {
        return this.createEntity(
            new Player(playerEntityId),
            [new EntityReference(playerEntityId, new Map())],
            undefined
        )
    }

    private createRobotEntity (robotEntityId:string, gameEvent:GameEvent): Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        return this.createEntity(
            new Robot(robotEntityId),
            [
                new Hittable(robotEntityId, 50),
                new Offensive(robotEntityId, 20),
                new EntityReference(robotEntityId, new Map([
                    [gameEvent.originEntityId, EntityType.player]
                ]))
            ],
            registerRobotEvent(robotEntityId, gameEvent.originEntityId)
        )
    }

    private createGameEntity (gameEntityId: string): Promise<void> {
        return this.createEntity(
            new Game(gameEntityId),
            [],
            createSimpleMatchLobbyEvent(gameEntityId, 'unknown')
        )
    }

    private createSimpleMatchLobbyEntity (simpleMatchLobbyEntityId: string): Promise<void> {
        return this.createEntity(
            new SimpleMatchLobby(simpleMatchLobbyEntityId),
            [new Playable(simpleMatchLobbyEntityId, [])]
        )
    }

    private createMatchEntity (matchEntityId: string): Promise<void> {
        return this.createEntity(
            new Match(matchEntityId),
            [new Playable(matchEntityId, []), new EntityReference(matchEntityId, new Map()), new Phasing(matchEntityId, PhaseType.PreparingGame)],
            matchWaitingForPlayers(matchEntityId)
        )
    }

    private createGridEntity (gridEntityId: string, gameEvent: GameEvent): Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        return this.createEntity(
            new Grid(gridEntityId),
            [new Dimensional(gridEntityId, { x: 25, y: 25 })],
            registerGridEvent(gameEvent.originEntityId, gridEntityId)
        )
    }

    private createTowerEntity (towerEntityId:string, gameEvent:GameEvent): Promise<void> {
        if (gameEvent.originEntityId === undefined) throw new Error(MissingOriginEntityId)
        return this.createEntity(
            new Tower(towerEntityId),
            [
                new Hittable(towerEntityId, 100),
                new Offensive(towerEntityId, 5),
                new EntityReference(towerEntityId, new Map([
                    [gameEvent.originEntityId, EntityType.player]
                ]))
            ],
            registerTowerEvent(towerEntityId, gameEvent.originEntityId)
        )
    }
}
