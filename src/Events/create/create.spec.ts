
import { Action } from '../../Event/Action'
import { theEntityIsNotOnRepository, whenEventOccurs, theEntityIsCreated, theEventIsSent, theEntityWithIdHasTheExpectedComponent, featureEventDescription, theEntityIsOnRepository, serverScenario, feature, clientScenario } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { Playable } from '../../Components/Playable'
import { EntityReference } from '../../Components/EntityReference'
import { createPlayerEvent, createSimpleMatchLobbyEvent, createRobotEvent, createTowerEvent, createMainMenuEvent, createGridEvent, createMatchEvent, createServerGameEvent, createPlayerSimpleMatchLobbyButtonEvent, createPlayerNextTurnMatchButtonEvent, createPlayerPointerEvent } from './create'
import { registerGridEvent, registerPlayerEvent, registerPlayerPointerEvent, registerRobotEvent, registerTowerEvent } from '../register/register'
import { showEvent } from '../show/show'
import { Dimensional } from '../../Components/Dimensional'
import { EntityType } from '../../Event/EntityType'
import { Hittable } from '../../Components/Hittable'
import { Offensive } from '../../Components/Offensive'
import { matchWaitingForPlayers } from '../waiting/waiting'
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
import { mainMenuPosition, Physical, simpleMatchLobbyPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
const mainMenuShowEvent = (mainMenuId:string, playerId:string) => showEvent(EntityType.mainMenu, mainMenuId, playerId, new Physical(mainMenuId, mainMenuPosition, ShapeType.mainMenu))
feature(featureEventDescription(Action.create), () => {
    clientScenario(`${Action.create} 1 - Create Player Client`, createPlayerEvent,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, createPlayerEvent),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.playerA),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'client', registerPlayerEvent(EntityId.playerA))
        ],
        [EntityId.playerA])
    serverScenario(`${Action.create} 2 - Create Main Menu Event`, createMainMenuEvent(EntityId.game, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.mainMenu),
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, createMainMenuEvent(EntityId.game, EntityId.playerA)),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.mainMenu),
            (game, adapters) => theEntityIsCreated(TestStep.And, adapters, EntityId.mainMenu),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.mainMenu, EntityReference, new EntityReference(EntityId.mainMenu, EntityType.mainMenu, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.mainMenu, Physical, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', mainMenuShowEvent(EntityId.mainMenu, EntityId.playerA))
        ],
        [EntityId.mainMenu])
    serverScenario(`${Action.create} 3 - Create Game Event`, createServerGameEvent, undefined, [
        (game, adapters) => whenEventOccurs(game, createServerGameEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.game),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map())),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createSimpleMatchLobbyEvent(EntityId.game, 'create'))
    ], [EntityId.game])

    serverScenario(`${Action.create} 4 - Create Simple Match Lobby Event`, createSimpleMatchLobbyEvent(EntityId.game, EntityId.simpleMatchLobby), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.simpleMatchLobby),
        (game, adapters) => whenEventOccurs(game, createSimpleMatchLobbyEvent(EntityId.game, EntityId.simpleMatchLobby)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.simpleMatchLobby),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, [])),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Physical, new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby))
    ], [EntityId.simpleMatchLobby])
    serverScenario(`${Action.create} 5 - Create Robot Event`, createRobotEvent(EntityId.playerA), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerARobot),
        (game, adapters) => whenEventOccurs(game, createRobotEvent(EntityId.playerA)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerARobot),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', registerRobotEvent(EntityId.playerARobot, EntityId.playerA)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Hittable, new Hittable(EntityId.playerARobot, 50)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Offensive, new Offensive(EntityId.playerARobot, 20))
    ], [EntityId.playerARobot])
    serverScenario(`${Action.create} 6 - Create Tower Event`, createTowerEvent(EntityId.playerA), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerBTower),
        (game, adapters) => whenEventOccurs(game, createTowerEvent(EntityId.playerA)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerBTower),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', registerTowerEvent(EntityId.playerBTower, EntityId.playerA)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Hittable, new Hittable(EntityId.playerBTower, 100)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Offensive, new Offensive(EntityId.playerBTower, 5))
    ], [EntityId.playerBTower])
    serverScenario(`${Action.create} 7 - Create Grid Event`, createGridEvent(EntityId.match), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.grid),
        (game, adapters) => whenEventOccurs(game, createGridEvent(EntityId.match)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.grid),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, Dimensional, new Dimensional(EntityId.grid, { x: 25, y: 25 })),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', registerGridEvent(EntityId.match, EntityId.grid))
    ], [EntityId.grid])
    serverScenario(`${Action.create} 8 - Create Match Event`, createMatchEvent(EntityId.simpleMatchLobby), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.match),
        (game, adapters) => whenEventOccurs(game, createMatchEvent(EntityId.simpleMatchLobby)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.match),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', matchWaitingForPlayers(EntityId.match, EntityId.simpleMatchLobby)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Playable, new Playable(EntityId.match, [])),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map())),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, preparingGamePhase))
    ], [EntityId.match])
    serverScenario(`${Action.create} 9 - Create Player Simple Match Lobby Button`, createPlayerSimpleMatchLobbyButtonEvent(EntityId.simpleMatchLobby, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityId.simpleMatchLobby).withEntityReferences(EntityType.simpleMatchLobby, new Map()).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map())),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerAJoinSimpleMatchButton),
            (game, adapters) => whenEventOccurs(game, createPlayerSimpleMatchLobbyButtonEvent(EntityId.simpleMatchLobby, EntityId.playerA)),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerAJoinSimpleMatchButton),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAJoinSimpleMatchButton, EntityReference, new EntityReference(EntityId.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]], [EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]])))
        ], [EntityId.playerAJoinSimpleMatchButton])
    serverScenario(`${Action.create} 10 - Create Player Next Turn Match Button`, createPlayerNextTurnMatchButtonEvent(EntityId.match, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map()).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map())),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerEndTurnButton),
            (game, adapters) => whenEventOccurs(game, createPlayerNextTurnMatchButtonEvent(EntityId.match, EntityId.playerA)),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerEndTurnButton),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerEndTurnButton, EntityReference, new EntityReference(EntityId.playerEndTurnButton, EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.match, [EntityId.match]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.button, [EntityId.playerEndTurnButton]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.button, [EntityId.playerEndTurnButton]]])))
        ], [EntityId.playerEndTurnButton])
    serverScenario(`${Action.create} 11 - Create Pointer Event`, createPlayerPointerEvent(EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerAPointer),
            (game, adapters) => whenEventOccurs(game, createPlayerPointerEvent(EntityId.playerA)),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.playerAPointer),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.pointer, [EntityId.playerAPointer]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA))
        ], [EntityId.playerAPointer])
})
