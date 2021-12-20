import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericServerLifeCycleSystem } from './GenericServerLifeCycleSystem'
import { createCellEvent, createDefeatEvent, createSimpleMatchLobbyEvent, createVictoryEvent } from '../../Events/create/create'
import { Dimensional } from '../../Components/Dimensional'
import { EntityType } from '../../Event/EntityType'
import { EntityReference } from '../../Components/EntityReference'
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
import { registerNextTurnButtonEvent, registerPlayerOnGameEvent, registerPlayerPointerEvent, registerRobotEvent, registerSimpleMatchLobbyOnGame, registerTowerEvent } from '../../Events/register/register'
import { matchWaitingForPlayers } from '../../Events/waiting/waiting'
import { Hittable } from '../../Components/Hittable'
import { Offensive } from '../../Components/Offensive'
import { Action } from '../../Event/Action'
import { Entity } from '../../Entities/Entity'
import { defaultJoinSimpleMatchButtonPosition, defaultPointerPosition, defeatPosition, mainMenuPosition, Physical, playerNextTurnButtonPosition, position, simpleMatchLobbyPosition, victoryPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Controller } from '../../Components/Controller'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { drawEvent } from '../../Events/draw/draw'
import { EntityId } from '../../Event/entityIds'
import { gameScreenDimension } from '../../Components/port/Dimension'
import { destroyCellEvent, destroyDefeatEvent, destroyGridEvent, destroyNextTurnButtonEvent, destroyVictoryEvent } from '../../Events/destroy/destroy'

export class ServerLifeCycleSystem extends GenericServerLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === Action.destroy
            ? this.onDestroyEvent(gameEvent)
            : gameEvent.action === Action.create
                ? this.onCreateEvent(gameEvent)
                : gameEvent.action === Action.register
                    ? this.onCreateEvent(gameEvent)
                    : Promise.reject(new Error(errorMessageOnUnknownEventAction(ServerLifeCycleSystem.name, gameEvent)))
    }

    private onCreateEvent (gameEvent: GameEvent): Promise<void> {
        const strategy = this.retrieveCreateStrategy(gameEvent)
        return strategy ? strategy() : Promise.reject(new Error(errorMessageOnUnknownEventAction(ServerLifeCycleSystem.name, gameEvent)))
    }

    private onDestroyEvent (gameEvent: GameEvent): Promise<void> {
        const additionnalEvents:GameEvent[] = []
        if (gameEvent.hasEntitiesByEntityType(EntityType.match)) additionnalEvents.push(...this.onMatchDestroyEvents(gameEvent.entityByEntityType(EntityType.match)))
        if (gameEvent.hasEntitiesByEntityType(EntityType.grid)) additionnalEvents.push(...this.onGridDestroyEvents(gameEvent.entityByEntityType(EntityType.grid)))
        if (gameEvent.hasEntitiesByEntityType(EntityType.simpleMatchLobbyMenu)) this.unlinkEntityByLink(gameEvent.entityByEntityType(EntityType.simpleMatchLobbyMenu), EntityType.player)
        if (gameEvent.hasEntitiesByEntityType(EntityType.robot)) this.unlinkEntityByLink(gameEvent.entityByEntityType(EntityType.robot), EntityType.player)
        if (gameEvent.hasEntitiesByEntityType(EntityType.tower)) this.unlinkEntityByLink(gameEvent.entityByEntityType(EntityType.tower), EntityType.player)
        if (gameEvent.hasEntitiesByEntityType(EntityType.nextTurnButton)) this.unlinkEntityByLink(gameEvent.entityByEntityType(EntityType.nextTurnButton), EntityType.player)
        gameEvent.allEntities().forEach(entityId => {
            this.interactWithEntities.deleteEntityById(entityId)
        })
        return this.sendEvents(additionnalEvents)
    }

    unlinkEntityByLink (entityId: string, entityTypeLink:EntityType) {
        const simpleMatchLobbyMenuEntityReference = this.interactWithEntities.retrieveEntityComponentByEntityId(entityId, EntityReference)
        const playerEntityReference = this.interactWithEntities.retrieveEntityComponentByEntityId(simpleMatchLobbyMenuEntityReference.retrieveReference(entityTypeLink), EntityReference)
        this.interactWithEntities.unlinkEntities(simpleMatchLobbyMenuEntityReference, playerEntityReference)
    }

    onGridDestroyEvents (gridId: string):GameEvent[] {
        const destroyGridEvents:GameEvent[] = []
        const gridEntityReference = this.interactWithEntities.retrieveEntityComponentByEntityId(gridId, EntityReference)
        destroyGridEvents.push(...gridEntityReference.retrieveReferences(EntityType.cell).map(cellId => destroyCellEvent(cellId)))
        return destroyGridEvents
    }

    onMatchDestroyEvents (matchId:string):GameEvent[] {
        const destroyMatchEvent:GameEvent[] = []
        const matchEntityReference = this.interactWithEntities.retrieveEntityComponentByEntityId(matchId, EntityReference)
        destroyMatchEvent.push(destroyGridEvent(matchEntityReference.retrieveReference(EntityType.grid)))
        destroyMatchEvent.push(destroyVictoryEvent(matchEntityReference.retrieveReference(EntityType.victory)))
        destroyMatchEvent.push(destroyDefeatEvent(matchEntityReference.retrieveReference(EntityType.defeat)))
        destroyMatchEvent.push(...matchEntityReference.retrieveReferences(EntityType.nextTurnButton).map(nextTurnButtonId => destroyNextTurnButtonEvent(nextTurnButtonId)))
        return destroyMatchEvent
    }

    private retrieveCreateStrategy (gameEvent:GameEvent):(()=>Promise<void>) | undefined {
        const allEntityTypes = gameEvent.allEntityTypes()
        return (gameEvent.hasEntitiesByEntityType(EntityType.mainMenu) && gameEvent.entitiesByEntityType(EntityType.mainMenu).some(entityId => entityId === EntityId.create))
            ? () => this.createPlayerMainMenu(this.interactWithIdentiers.nextIdentifier(), gameEvent)
            : allEntityTypes.includes(EntityType.player) && allEntityTypes.includes(EntityType.simpleMatchLobbyMenu)
                ? () => this.createPlayerSimpleMatchLobbyMenuEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                : allEntityTypes.includes(EntityType.player) && allEntityTypes.includes(EntityType.pointer)
                    ? () => this.createPointerEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                    : allEntityTypes.includes(EntityType.simpleMatchLobby) && allEntityTypes.includes(EntityType.player)
                        ? () => this.createSimpleMatchLobbyButtonEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                        : allEntityTypes.includes(EntityType.player) && allEntityTypes.includes(EntityType.match)
                            ? () => this.createNextTurnPlayerMatchButton(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                            : allEntityTypes.includes(EntityType.tower) && allEntityTypes.includes(EntityType.player)
                                ? () => this.createTowerEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                : allEntityTypes.includes(EntityType.victory)
                                    ? () => this.createVictoryEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                    : allEntityTypes.includes(EntityType.defeat)
                                        ? () => this.createDefeatEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                        : allEntityTypes.includes(EntityType.robot)
                                            ? () => this.createRobotEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                            : allEntityTypes.includes(EntityType.player)
                                                ? () => this.createPlayerEntity(gameEvent)
                                                : allEntityTypes.includes(EntityType.grid) && allEntityTypes.includes(EntityType.cell)
                                                    ? () => this.createCellEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                                    : allEntityTypes.includes(EntityType.grid)
                                                        ? () => this.createGridEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
                                                        : allEntityTypes.includes(EntityType.match)
                                                            ? () => this.createMatchEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent.entityByEntityType(EntityType.simpleMatchLobby))
                                                            : allEntityTypes.includes(EntityType.simpleMatchLobby)
                                                                ? () => this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent.entityByEntityType(EntityType.game))
                                                                : allEntityTypes.includes(EntityType.game)
                                                                    ? () => this.createGameEntity(this.interactWithIdentiers.nextIdentifier())
                                                                    : undefined
    }

    private createDefeatEntity (defeatEntityId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(defeatEntityId),
            [
                new Physical(defeatEntityId, defeatPosition, ShapeType.defeat, false),
                new EntityReference(defeatEntityId, EntityType.defeat)
            ]
        )
        this.interactWithEntities.linkEntityToEntities(defeatEntityId, [gameEvent.entityByEntityType(EntityType.match)])
        return Promise.resolve()
    }

    private createVictoryEntity (victoryEntityId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(victoryEntityId),
            [
                new Physical(victoryEntityId, victoryPosition, ShapeType.victory, false),
                new EntityReference(victoryEntityId, EntityType.victory)
            ]
        )
        this.interactWithEntities.linkEntityToEntities(victoryEntityId, [gameEvent.entityByEntityType(EntityType.match)])
        return Promise.resolve()
    }

    private createCellEntity (cellId: string, gameEvent: GameEvent): Promise<void> {
        const cellPhysicalComponentOnGameEvent = gameEvent.retrieveComponent(EntityId.create, Physical)
        cellPhysicalComponentOnGameEvent.entityId = cellId
        const entityType = EntityType.cell
        this.createEntity(
            new Entity(cellId),
            [
                new EntityReference(cellId, entityType),
                cellPhysicalComponentOnGameEvent
            ]
        )
        const gridId = gameEvent.entityByEntityType(EntityType.grid)
        this.interactWithEntities.linkEntityToEntities(cellId, [gridId])
        const matchId = this.interactWithEntities.retrieveEntityComponentByEntityId(gridId, EntityReference).retrieveReference(EntityType.match)
        const players = this.interactWithEntities.retrieveEntityComponentByEntityId(matchId, EntityReference).retrieveReferences(EntityType.player)
        return this.sendNextEvents(players.map(player => drawEvent(player, cellPhysicalComponentOnGameEvent)))
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
        const playerMainMenuId = playerEntityReference.retrieveReference(EntityType.mainMenu)
        const playerButtons = playerEntityReference.retrieveReferences(EntityType.button)
        const playerJoinSimpleMatchButtonId = this.interactWithEntities.retrieveEntityComponentByEntityId(playerMainMenuId, EntityReference).retrieveReferences(EntityType.button).find(mainMenuButton => playerButtons.some(playerButton => playerButton === mainMenuButton))

        if (playerJoinSimpleMatchButtonId) {
            const mainMenuPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(playerMainMenuId, Physical)
            mainMenuPhysicalComponent.visible = false
            const simpleMatchLobbyButtonPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(playerJoinSimpleMatchButtonId, Physical)
            simpleMatchLobbyButtonPhysicalComponent.visible = false
            return this.sendNextEvents([
                drawEvent(playerId, this.interactWithEntities.retrieveEntityComponentByEntityId(playerSimpleMatchLobbyMenuId, Physical)),
                drawEvent(playerId, mainMenuPhysicalComponent),
                drawEvent(playerId, simpleMatchLobbyButtonPhysicalComponent)
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
        return this.sendEvent(drawEvent(playerId, this.interactWithEntities.retrieveEntityComponentByEntityId(playerMainMenuEntityId, Physical)))
    }

    private createNextTurnPlayerMatchButton (playerNextTurnMatchButtonId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(playerNextTurnMatchButtonId),
            [
                new EntityReference(playerNextTurnMatchButtonId, EntityType.nextTurnButton),
                new Physical(playerNextTurnMatchButtonId, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)
            ]
        )
        return this.sendEvent(registerNextTurnButtonEvent(gameEvent.entityByEntityType(EntityType.player), gameEvent.entityByEntityType(EntityType.match), playerNextTurnMatchButtonId))
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
            this.interactWithEntities.retrieveEntityComponentByEntityId(playerId, EntityReference).retrieveReference(EntityType.mainMenu)
        ])
        return this.sendEvent(drawEvent(playerId, this.interactWithEntities.retrieveEntityComponentByEntityId(joinSimpleMatchButtonId, Physical)))
    }

    private createPlayerEntity (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
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
                new Physical(robotEntityId, position(0, 0), ShapeType.robot, true)
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
                new EntityReference(simpleMatchLobbyEntityId, EntityType.simpleMatchLobby)
            ]
        )
        return this.sendEvent(registerSimpleMatchLobbyOnGame(gameId, simpleMatchLobbyEntityId))
    }

    private createMatchEntity (matchEntityId: string, simpleMatchLobbyEntityId:string): Promise<void> {
        this.createEntity(
            new Entity(matchEntityId),
            [
                new EntityReference(matchEntityId, EntityType.match, new Map()),
                new Phasing(matchEntityId, preparingGamePhase)
            ]
        )
        return this.sendNextEvents([
            matchWaitingForPlayers(matchEntityId, simpleMatchLobbyEntityId),
            createVictoryEvent(matchEntityId),
            createDefeatEvent(matchEntityId)
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
        const gridOffset = Math.floor((gameScreenDimension.x - gridDimensionalComponent.dimensions.x) / 2) + 1
        const createCellEvents:GameEvent[] = []
        for (let x = 0; x < gridDimensionalComponent.dimensions.x; x++)
            for (let y = 0; y < gridDimensionalComponent.dimensions.y; y++)
                createCellEvents.push(createCellEvent(gridEntityId, position(x + gridOffset, y + gridOffset)))
        const matchId = gameEvent.entityByEntityType(EntityType.match)
        this.interactWithEntities.linkEntityToEntities(gridEntityId, [matchId])
        return this.sendNextEvents([...createCellEvents])
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
                new Physical(towerEntityId, position(0, 0), ShapeType.tower, true)
            ]
        )
        return this.sendNextEvents([registerTowerEvent(towerEntityId, playerId)])
    }
}
