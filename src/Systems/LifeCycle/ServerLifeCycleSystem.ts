import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericServerLifeCycleSystem } from './GenericServerLifeCycleSystem'
import { createCellEvent, createSimpleMatchLobbyEvent } from '../../Events/create/create'
import { Playable } from '../../Components/Playable'
import { Dimensional } from '../../Components/Dimensional'
import { EntityType } from '../../Event/EntityType'
import { EntityReference } from '../../Components/EntityReference'
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
import { registerGridEvent, registerPlayerOnGameEvent, registerPlayerPointerEvent, registerRobotEvent, registerSimpleMatchLobbyOnGame, registerTowerEvent } from '../../Events/register/register'
import { matchWaitingForPlayers } from '../../Events/waiting/waiting'
import { Hittable } from '../../Components/Hittable'
import { Offensive } from '../../Components/Offensive'
import { Action } from '../../Event/Action'
import { Entity } from '../../Entities/Entity'
import { defaultJoinSimpleMatchButtonPosition, defaultPointerPosition, mainMenuPosition, Physical, position, simpleMatchLobbyPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Controller } from '../../Components/Controller'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { drawEvent } from '../../Events/show/draw'
import { EntityId } from '../../Event/entityIds'
export class ServerLifeCycleSystem extends GenericServerLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.destroy) return this.onDestroyEvent(gameEvent)
        if (gameEvent.action === Action.create) return this.onCreateEvent(gameEvent)
        if (gameEvent.action === Action.register) return this.onCreateEvent(gameEvent)
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
        return (gameEvent.hasEntitiesByEntityType(EntityType.mainMenu) && gameEvent.entitiesByEntityType(EntityType.mainMenu).some(entityId => entityId === EntityId.create))
            ? () => this.createPlayerMainMenu(this.interactWithIdentiers.nextIdentifier(), gameEvent)
            : (allEntityTypes.includes(EntityType.player) && allEntityTypes.includes(EntityType.simpleMatchLobbyMenu))
                ? () => this.createPlayerSimpleMatchLobbyMenuEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                : (allEntityTypes.includes(EntityType.player) && allEntityTypes.includes(EntityType.pointer))
                    ? () => this.createPointerEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                    : (allEntityTypes.includes(EntityType.simpleMatchLobby) && allEntityTypes.includes(EntityType.player))
                        ? () => this.createSimpleMatchLobbyButtonEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                        : (allEntityTypes.includes(EntityType.player) && allEntityTypes.includes(EntityType.match))
                            ? () => this.createNextTurnPlayerMatchButton(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                            : (allEntityTypes.includes(EntityType.tower) && allEntityTypes.includes(EntityType.player))
                                ? () => this.createTowerEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                : (allEntityTypes.includes(EntityType.robot))
                                    ? () => this.createRobotEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                    : (allEntityTypes.includes(EntityType.player))
                                        ? () => this.createPlayerEntity(gameEvent)
                                        : (allEntityTypes.includes(EntityType.grid) && allEntityTypes.includes(EntityType.cell))
                                            ? () => this.createCellEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                            : (allEntityTypes.includes(EntityType.grid))
                                                ? () => this.createGridEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                                : (allEntityTypes.includes(EntityType.match))
                                                    ? () => this.createMatchEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent.entityByEntityType(EntityType.simpleMatchLobby))
                                                    : (allEntityTypes.includes(EntityType.simpleMatchLobby))
                                                        ? () => this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent.entityByEntityType(EntityType.game))
                                                        : (allEntityTypes.includes(EntityType.game))
                                                            ? () => this.createGameEntity(this.interactWithIdentiers.nextIdentifier())
                                                            : undefined
    }

    private createCellEntity (cellId: string, gameEvent: GameEvent): Promise<void> {
        const cellPhysicalComponentOnGameEvent = gameEvent.retrieveComponent(EntityId.create, Physical)
        cellPhysicalComponentOnGameEvent.entityId = cellId
        this.createEntity(
            new Entity(cellId),
            [
                new EntityReference(cellId, EntityType.cell),
                cellPhysicalComponentOnGameEvent
            ]
        )
        this.interactWithEntities.linkEntityToEntities(cellId, [gameEvent.entityByEntityType(EntityType.grid)])
        return Promise.resolve()
    }

    private createPlayerSimpleMatchLobbyMenuEntity (playerSimpleMatchLobbyMenuId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(playerSimpleMatchLobbyMenuId),
            [
                new EntityReference(playerSimpleMatchLobbyMenuId, EntityType.simpleMatchLobbyMenu),
                new Physical(playerSimpleMatchLobbyMenuId, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyMenu, true)
            ]
        )
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.interactWithEntities.linkEntityToEntities(playerSimpleMatchLobbyMenuId, [playerId])
        const playerEntityReference = this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference)
        const playerMainMenuId = playerEntityReference.retreiveReference(EntityType.mainMenu)
        const playerButtons = playerEntityReference.retrieveReferences(EntityType.button)
        const playerJoinSimpleMatchButtonId = this.interactWithEntities.retrieveEntityComponentByEntityId(playerMainMenuId, EntityReference).retrieveReferences(EntityType.button).find(mainMenuButton => playerButtons.some(playerButton => playerButton === mainMenuButton))

        if (playerJoinSimpleMatchButtonId) {
            const mainMenuPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(playerMainMenuId, Physical)
            mainMenuPhysicalComponent.visible = false
            const simpleMatchLobbyButtonPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(playerJoinSimpleMatchButtonId, Physical)
            simpleMatchLobbyButtonPhysicalComponent.visible = false
            return this.sendNextEvents([
                drawEvent(this.interactWithEntities.retrieveEntityComponentByEntityId(playerSimpleMatchLobbyMenuId, EntityReference).retrieveEntityType(), playerSimpleMatchLobbyMenuId, playerId, this.interactWithEntities.retrieveEntityComponentByEntityId(playerSimpleMatchLobbyMenuId, Physical)),
                drawEvent(this.interactWithEntities.retrieveEntityComponentByEntityId(playerMainMenuId, EntityReference).retrieveEntityType(), playerMainMenuId, playerId, mainMenuPhysicalComponent),
                drawEvent(this.interactWithEntities.retrieveEntityComponentByEntityId(playerJoinSimpleMatchButtonId, EntityReference).retrieveEntityType(), playerJoinSimpleMatchButtonId, playerId, simpleMatchLobbyButtonPhysicalComponent)
            ])
        }
        return Promise.reject(new Error('Missing player join simple match lobby button on player buttons or on main menu buttons.'))
    }

    private createPointerEntity (pointerId:string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(pointerId),
            [
                new EntityReference(pointerId, EntityType.pointer),
                new Physical(pointerId, defaultPointerPosition, ShapeType.pointer, true),
                new Controller(pointerId, ControlStatus.Idle)
            ]
        )
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.interactWithEntities.linkEntityToEntities(pointerId, [playerId])
        return this.sendEvent(registerPlayerPointerEvent(pointerId, playerId))
    }

    private createPlayerMainMenu (playerMainMenuEntityId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(playerMainMenuEntityId),
            [
                new EntityReference(playerMainMenuEntityId, EntityType.mainMenu, new Map()),
                new Physical(playerMainMenuEntityId, mainMenuPosition, ShapeType.mainMenu, true)
            ]
        )
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.interactWithEntities.linkEntityToEntities(playerMainMenuEntityId, [playerId])
        return this.sendEvent(drawEvent(EntityType.mainMenu, playerMainMenuEntityId, playerId, this.interactWithEntities.retrieveEntityComponentByEntityId(playerMainMenuEntityId, Physical)))
    }

    private createNextTurnPlayerMatchButton (playerNextTurnMatchButtonId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(playerNextTurnMatchButtonId),
            [
                new EntityReference(playerNextTurnMatchButtonId, EntityType.button)
            ]
        )
        this.interactWithEntities.linkEntityToEntities(playerNextTurnMatchButtonId, [gameEvent.entityByEntityType(EntityType.match), gameEvent.entityByEntityType(EntityType.player)])
        return Promise.resolve()
    }

    private createSimpleMatchLobbyButtonEntity (joinSimpleMatchButtonId: string, gameEvent: GameEvent): Promise<void> {
        const entityType = EntityType.button
        this.createEntity(
            new Entity(joinSimpleMatchButtonId),
            [
                new EntityReference(joinSimpleMatchButtonId, entityType),
                new Physical(joinSimpleMatchButtonId, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)
            ]
        )
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.interactWithEntities.linkEntityToEntities(joinSimpleMatchButtonId, [
            playerId,
            gameEvent.entityByEntityType(EntityType.simpleMatchLobby),
            this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference).retreiveReference(EntityType.mainMenu)
        ])
        return this.sendEvent(drawEvent(entityType, joinSimpleMatchButtonId, playerId, this.interactWithEntities.retrieveEntityComponentByEntityId(joinSimpleMatchButtonId, Physical)))
    }

    private createPlayerEntity (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        console.log(`
        ========= >>> NEW PLAYER => ${playerId}
        `)
        const entitiesWithEntityReferenceComponent = this.interactWithEntities.retrieveEntitiesThatHaveComponent(EntityReference)
        const gameEntity = entitiesWithEntityReferenceComponent.find(entityWithEntityReferenceComponent => entityWithEntityReferenceComponent.retrieveComponent(EntityReference).entityType.some(entityType => entityType === EntityType.game))
        if (!gameEntity) return Promise.reject(new Error('Game entity not found'))
        this.createEntity(
            new Entity(playerId),
            [new EntityReference(playerId, EntityType.player, new Map())]
        )
        return this.sendEvent(registerPlayerOnGameEvent(playerId, gameEntity.id))
    }

    private createRobotEntity (robotEntityId:string, gameEvent:GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.createEntity(
            new Entity(robotEntityId),
            [
                new Hittable(robotEntityId, 50),
                new Offensive(robotEntityId, 20),
                new EntityReference(robotEntityId, EntityType.robot, new Map([
                    [EntityType.player, [playerId]]
                ])),
                new Physical(robotEntityId, position(0, 0), ShapeType.robot, false)
            ]
        )
        return this.sendNextEvents([registerRobotEvent(robotEntityId, playerId)])
    }

    private createGameEntity (gameId: string): Promise<void> {
        this.createEntity(
            new Entity(gameId),
            [new EntityReference(gameId, EntityType.game)]
        )
        return this.sendNextEvents([createSimpleMatchLobbyEvent(gameId)])
    }

    private createSimpleMatchLobbyEntity (simpleMatchLobbyEntityId: string, gameId:string): Promise<void> {
        this.createEntity(
            new Entity(simpleMatchLobbyEntityId),
            [
                new Playable(simpleMatchLobbyEntityId, []),
                new EntityReference(simpleMatchLobbyEntityId, EntityType.simpleMatchLobby)
                // new Physical(simpleMatchLobbyEntityId, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby)
            ]
        )
        return this.sendEvent(registerSimpleMatchLobbyOnGame(gameId, simpleMatchLobbyEntityId))
    }

    private createMatchEntity (matchEntityId: string, simpleMatchLobbyEntityId:string): Promise<void> {
        this.createEntity(
            new Entity(matchEntityId),
            [new Playable(matchEntityId, []), new EntityReference(matchEntityId, EntityType.match, new Map()), new Phasing(matchEntityId, preparingGamePhase)]
        )
        return this.sendNextEvents([
            matchWaitingForPlayers(matchEntityId, simpleMatchLobbyEntityId)
        ])
    }

    private createGridEntity (gridEntityId: string, gameEvent: GameEvent): Promise<void> {
        const gridDimensionalComponent = gameEvent.retrieveComponent(EntityId.create, Dimensional)
        gridDimensionalComponent.entityId = gridEntityId
        this.createEntity(
            new Entity(gridEntityId),
            [
                gridDimensionalComponent,
                new EntityReference(gridEntityId, EntityType.grid)
            ]
        )
        const createCellEvents:GameEvent[] = []
        for (let x = 1; x <= gridDimensionalComponent.dimensions.x; x++)
            for (let y = 1; y <= gridDimensionalComponent.dimensions.y; y++)
                createCellEvents.push(createCellEvent(gridEntityId, position(x, y)))

        return this.sendNextEvents([
            registerGridEvent(gameEvent.entityByEntityType(EntityType.match), gridEntityId),
            ...createCellEvents
        ])
    }

    private createTowerEntity (towerEntityId:string, gameEvent:GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        this.createEntity(
            new Entity(towerEntityId),
            [
                new Hittable(towerEntityId, 100),
                new Offensive(towerEntityId, 5),
                new EntityReference(towerEntityId, EntityType.tower, new Map([
                    [EntityType.player, [playerId]]
                ])),
                new Physical(towerEntityId, position(0, 0), ShapeType.tower, false)
            ]
        )
        return this.sendNextEvents([registerTowerEvent(towerEntityId, playerId)])
    }
}
