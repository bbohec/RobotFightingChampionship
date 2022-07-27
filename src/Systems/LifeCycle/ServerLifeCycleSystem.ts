import { makeController } from '../../core/components/Controller'
import { Dimensional, gameScreenDimension } from '../../core/components/Dimensional'
import { makeEntityReference, retrieveReference, retrieveReferences } from '../../core/components/EntityReference'
import { makeHittable } from '../../core/components/Hittable'
import { makeOffensive } from '../../core/components/Offensive'
import { makePhasing, preparingGamePhase } from '../../core/components/Phasing'
import { defaultJoinSimpleMatchButtonPosition, defaultPointerPosition, defeatPosition, mainMenuPosition, makePhysical, Physical, playerNextTurnButtonPosition, position, simpleMatchLobbyPosition, victoryPosition } from '../../core/components/Physical'
import { ControlStatus } from '../../core/components/ControlStatus'
import { ShapeType } from '../../core/type/ShapeType'
import { Entity, EntityId } from '../../Entities/Entity'
import { Action } from '../../core/type/Action'
import { EntityIds } from '../../test/entityIds'
import { EntityType } from '../../core/type/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../core/type/GameEvent'
import { createCellEvent, createDefeatEvent, createSimpleMatchLobbyEvent, createVictoryEvent } from '../../core/events/create/create'
import { destroyCellEvent, destroyDefeatEvent, destroyGridEvent, destroyNextTurnButtonEvent, destroyVictoryEvent } from '../../core/events/destroy/destroy'
import { drawEvent } from '../../core/events/draw/draw'
import { registerNextTurnButtonEvent, registerPlayerOnGameEvent, registerPlayerPointerEvent, registerRobotEvent, registerSimpleMatchLobbyOnGame, registerTowerEvent } from '../../core/events/register/register'
import { matchWaitingForPlayers } from '../../core/events/waiting/waiting'
import { GenericServerLifeCycleSystem } from './GenericServerLifeCycleSystem'

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
        if (this.hasEntitiesByEntityType(gameEvent, EntityType.match)) additionnalEvents.push(...this.onMatchDestroyEvents(this.entityByEntityType(gameEvent, EntityType.match)))
        if (this.hasEntitiesByEntityType(gameEvent, EntityType.grid)) additionnalEvents.push(...this.onGridDestroyEvents(this.entityByEntityType(gameEvent, EntityType.grid)))
        if (this.hasEntitiesByEntityType(gameEvent, EntityType.simpleMatchLobbyMenu)) this.unlinkEntityByLink(this.entityByEntityType(gameEvent, EntityType.simpleMatchLobbyMenu), EntityType.player)
        if (this.hasEntitiesByEntityType(gameEvent, EntityType.robot)) this.unlinkEntityByLink(this.entityByEntityType(gameEvent, EntityType.robot), EntityType.player)
        if (this.hasEntitiesByEntityType(gameEvent, EntityType.tower)) this.unlinkEntityByLink(this.entityByEntityType(gameEvent, EntityType.tower), EntityType.player)
        if (this.hasEntitiesByEntityType(gameEvent, EntityType.nextTurnButton)) this.unlinkEntityByLink(this.entityByEntityType(gameEvent, EntityType.nextTurnButton), EntityType.player)
        this.allEntities(gameEvent).forEach(entityId => {
            this.interactWithEntities.deleteEntity(entityId)
        })
        return this.sendEvents(additionnalEvents)
    }

    unlinkEntityByLink (entityId: string, entityTypeLink:EntityType) {
        const entityReference = this.interactWithEntities.retreiveEntityReference(entityId)
        const remoteEntityReferences = retrieveReferences(entityReference, entityTypeLink).map(entity => this.interactWithEntities.retreiveEntityReference(entity))
        remoteEntityReferences.map(remoteEntityReference => this.interactWithEntities.unlinkEntities(entityReference, remoteEntityReference))
    }

    onGridDestroyEvents (gridId: string):GameEvent[] {
        const destroyGridEvents:GameEvent[] = []
        const gridEntityReference = this.interactWithEntities.retreiveEntityReference(gridId)
        destroyGridEvents.push(...retrieveReferences(gridEntityReference, EntityType.cell).map(cellId => destroyCellEvent(cellId)))
        return destroyGridEvents
    }

    onMatchDestroyEvents (matchId:string):GameEvent[] {
        const destroyMatchEvent:GameEvent[] = []
        const matchEntityReference = this.interactWithEntities.retreiveEntityReference(matchId)
        destroyMatchEvent.push(destroyGridEvent(retrieveReference(matchEntityReference, EntityType.grid)))
        destroyMatchEvent.push(destroyVictoryEvent(retrieveReference(matchEntityReference, EntityType.victory)))
        destroyMatchEvent.push(destroyDefeatEvent(retrieveReference(matchEntityReference, EntityType.defeat)))
        destroyMatchEvent.push(...retrieveReferences(matchEntityReference, EntityType.nextTurnButton).map(nextTurnButtonId => destroyNextTurnButtonEvent(nextTurnButtonId)))
        this.unlinkEntityByLink(matchId, EntityType.grid)
        return destroyMatchEvent
    }

    private retrieveCreateStrategy (gameEvent:GameEvent):(()=>Promise<void>) | undefined {
        const allEntityTypes = this.allEntityTypes(gameEvent)
        return (this.hasEntitiesByEntityType(gameEvent, EntityType.mainMenu) && this.entitiesByEntityType(gameEvent, EntityType.mainMenu).some(entityId => entityId === EntityIds.create))
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
                                                            ? () => this.createMatchEntity(this.interactWithIdentiers.nextIdentifier(), this.entityByEntityType(gameEvent, EntityType.simpleMatchLobby))
                                                            : allEntityTypes.includes(EntityType.simpleMatchLobby)
                                                                ? () => this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier(), this.entityByEntityType(gameEvent, EntityType.game))
                                                                : allEntityTypes.includes(EntityType.game)
                                                                    ? () => this.createGameEntity(this.interactWithIdentiers.nextIdentifier())
                                                                    : undefined
    }

    private createDefeatEntity (defeatEntityId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(defeatEntityId),
            [
                makePhysical(defeatEntityId, defeatPosition, ShapeType.defeat, false),
                makeEntityReference(defeatEntityId, EntityType.defeat)
            ]
        )
        this.interactWithEntities.linkEntityToEntities(defeatEntityId, [this.entityByEntityType(gameEvent, EntityType.match)])
        return Promise.resolve()
    }

    private createVictoryEntity (victoryEntityId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(victoryEntityId),
            [
                makePhysical(victoryEntityId, victoryPosition, ShapeType.victory, false),
                makeEntityReference(victoryEntityId, EntityType.victory)
            ]
        )
        this.interactWithEntities.linkEntityToEntities(victoryEntityId, [this.entityByEntityType(gameEvent, EntityType.match)])
        return Promise.resolve()
    }

    private createCellEntity (cellId: string, gameEvent: GameEvent): Promise<void> {
        const cellPhysicalComponentOnGameEvent:Physical = {
            ...this.retrievePhysical(gameEvent, EntityIds.create),
            entityId: cellId
        }
        const entityType = EntityType.cell
        this.createEntity(
            new Entity(cellId),
            [
                makeEntityReference(cellId, entityType),
                cellPhysicalComponentOnGameEvent
            ]
        )
        const gridId = this.entityByEntityType(gameEvent, EntityType.grid)
        this.interactWithEntities.linkEntityToEntities(cellId, [gridId])
        const matchId = retrieveReference(this.interactWithEntities.retreiveEntityReference(gridId), EntityType.match)
        const players = retrieveReferences(this.interactWithEntities.retreiveEntityReference(matchId), EntityType.player)
        return this.sendNextEvents(players.map(player => drawEvent(player, cellPhysicalComponentOnGameEvent)))
    }

    private createPlayerSimpleMatchLobbyMenuEntity (playerSimpleMatchLobbyMenuId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(playerSimpleMatchLobbyMenuId),
            [
                makeEntityReference(playerSimpleMatchLobbyMenuId, EntityType.simpleMatchLobbyMenu),
                makePhysical(playerSimpleMatchLobbyMenuId, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyMenu, true)
            ]
        )
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        this.interactWithEntities.linkEntityToEntities(playerSimpleMatchLobbyMenuId, [playerId])
        const playerEntityReference = this.interactWithEntities.retreiveEntityReference(playerId)
        const playerMainMenuId = retrieveReference(playerEntityReference, EntityType.mainMenu)
        const playerButtons = retrieveReferences(playerEntityReference, EntityType.button)
        const playerJoinSimpleMatchButtonId = retrieveReferences(this.interactWithEntities.retreiveEntityReference(playerMainMenuId), EntityType.button)
            .find(mainMenuButton => playerButtons.some(playerButton => playerButton === mainMenuButton))

        if (playerJoinSimpleMatchButtonId) {
            const mainMenuPhysicalComponent:Physical = {
                ...this.interactWithEntities.retrievePhysical(playerMainMenuId),
                visible: false
            }
            const simpleMatchLobbyButtonPhysicalComponent:Physical = {
                ...this.interactWithEntities.retrievePhysical(playerJoinSimpleMatchButtonId),
                visible: false
            }
            return this.sendNextEvents([
                drawEvent(playerId, this.interactWithEntities.retrievePhysical(playerSimpleMatchLobbyMenuId)),
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
                makeEntityReference(pointerId, EntityType.pointer),
                makePhysical(pointerId, defaultPointerPosition, ShapeType.pointer, true),
                makeController(pointerId, ControlStatus.Idle)
            ]
        )
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        this.interactWithEntities.linkEntityToEntities(pointerId, [playerId])
        return this.sendEvent(registerPlayerPointerEvent(pointerId, playerId))
    }

    private createPlayerMainMenu (playerMainMenuEntityId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(playerMainMenuEntityId),
            [
                makeEntityReference(playerMainMenuEntityId, EntityType.mainMenu, new Map()),
                makePhysical(playerMainMenuEntityId, mainMenuPosition, ShapeType.mainMenu, true)
            ]
        )
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        this.interactWithEntities.linkEntityToEntities(playerMainMenuEntityId, [playerId])
        return this.sendEvent(drawEvent(playerId, this.interactWithEntities.retrievePhysical(playerMainMenuEntityId)))
    }

    private createNextTurnPlayerMatchButton (playerNextTurnMatchButtonId: string, gameEvent: GameEvent): Promise<void> {
        this.createEntity(
            new Entity(playerNextTurnMatchButtonId),
            [
                makeEntityReference(playerNextTurnMatchButtonId, EntityType.nextTurnButton),
                makePhysical(playerNextTurnMatchButtonId, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)
            ]
        )
        return this.sendEvent(registerNextTurnButtonEvent(this.entityByEntityType(gameEvent, EntityType.player), this.entityByEntityType(gameEvent, EntityType.match), playerNextTurnMatchButtonId))
    }

    private createSimpleMatchLobbyButtonEntity (joinSimpleMatchButtonId: string, gameEvent: GameEvent): Promise<void> {
        const entityType = EntityType.button
        this.createEntity(
            new Entity(joinSimpleMatchButtonId),
            [
                makeEntityReference(joinSimpleMatchButtonId, entityType),
                makePhysical(joinSimpleMatchButtonId, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)
            ]
        )
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        this.interactWithEntities.linkEntityToEntities(joinSimpleMatchButtonId, [
            playerId,
            this.entityByEntityType(gameEvent, EntityType.simpleMatchLobby),
            retrieveReference(this.interactWithEntities.retreiveEntityReference(playerId), EntityType.mainMenu)
        ])
        return this.sendEvent(drawEvent(playerId, this.interactWithEntities.retrievePhysical(joinSimpleMatchButtonId)))
    }

    private createPlayerEntity (gameEvent: GameEvent): Promise<void> {
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        const entitiesWithEntityReferenceComponent = this.interactWithEntities.retrieveEntitiesThatHaveComponent('EntityReference')
        const gameEntity = entitiesWithEntityReferenceComponent.find(entityWithEntityReferenceComponent => entityWithEntityReferenceComponent.retrieveEntityReference().entityType.some(entityType => entityType === EntityType.game))
        if (!gameEntity) return Promise.reject(new Error('Game entity not found'))
        this.createEntity(
            new Entity(playerId),
            [makeEntityReference(playerId, EntityType.player, new Map())]
        )
        return this.sendEvent(registerPlayerOnGameEvent(playerId, gameEntity.id))
    }

    private createRobotEntity (robotEntityId:string, gameEvent:GameEvent): Promise<void> {
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        this.createEntity(
            new Entity(robotEntityId),
            [
                makeHittable(robotEntityId, 50),
                makeOffensive(robotEntityId, 20),
                makeEntityReference(robotEntityId, EntityType.robot, new Map([
                    [EntityType.player, [playerId]]
                ])),
                makePhysical(robotEntityId, position(0, 0), ShapeType.robot, true)
            ]
        )
        return this.sendNextEvents([registerRobotEvent(robotEntityId, playerId)])
    }

    private createGameEntity (gameId: string): Promise<void> {
        this.createEntity(
            new Entity(gameId),
            [makeEntityReference(gameId, EntityType.game)]
        )
        return this.sendNextEvents([createSimpleMatchLobbyEvent(gameId)])
    }

    private createSimpleMatchLobbyEntity (simpleMatchLobbyEntityId: string, gameId:string): Promise<void> {
        this.createEntity(
            new Entity(simpleMatchLobbyEntityId),
            [
                makeEntityReference(simpleMatchLobbyEntityId, EntityType.simpleMatchLobby)
            ]
        )
        return this.sendEvent(registerSimpleMatchLobbyOnGame(gameId, simpleMatchLobbyEntityId))
    }

    private createMatchEntity (matchEntityId: EntityId, simpleMatchLobbyEntityId:string): Promise<void> {
        this.createEntity(
            new Entity(matchEntityId),
            [
                makeEntityReference(matchEntityId, EntityType.match, new Map()),
                makePhasing(matchEntityId, preparingGamePhase)
            ]
        )
        return this.sendNextEvents([
            matchWaitingForPlayers(matchEntityId, simpleMatchLobbyEntityId),
            createVictoryEvent(matchEntityId),
            createDefeatEvent(matchEntityId)
        ])
    }

    private createGridEntity (gridEntityId: string, gameEvent: GameEvent): Promise<void> {
        const gridDimensionalComponent:Dimensional = {
            ...this.retrieveDimensional(gameEvent, EntityIds.create),
            entityId: gridEntityId

        }
        this.createEntity(
            new Entity(gridEntityId),
            [
                gridDimensionalComponent,
                makeEntityReference(gridEntityId, EntityType.grid)
            ]
        )
        const gridOffset = Math.floor((gameScreenDimension.x - gridDimensionalComponent.dimensions.x) / 2) + 1
        const createCellEvents:GameEvent[] = []
        for (let x = 0; x < gridDimensionalComponent.dimensions.x; x++)
            for (let y = 0; y < gridDimensionalComponent.dimensions.y; y++)
                createCellEvents.push(createCellEvent(gridEntityId, position(x + gridOffset, y + gridOffset)))
        const matchId = this.entityByEntityType(gameEvent, EntityType.match)
        this.interactWithEntities.linkEntityToEntities(gridEntityId, [matchId])
        return this.sendNextEvents([...createCellEvents])
    }

    private createTowerEntity (towerEntityId:string, gameEvent:GameEvent): Promise<void> {
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        this.createEntity(
            new Entity(towerEntityId),
            [
                makeHittable(towerEntityId, 100),
                makeOffensive(towerEntityId, 5),
                makeEntityReference(towerEntityId, EntityType.tower, new Map([
                    [EntityType.player, [playerId]]
                ])),
                makePhysical(towerEntityId, position(0, 0), ShapeType.tower, true)
            ]
        )
        return this.sendNextEvents([registerTowerEvent(towerEntityId, playerId)])
    }
}
