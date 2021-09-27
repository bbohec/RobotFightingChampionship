
import { Action } from '../../Event/Action'
import { theEntityIsNotOnRepository, whenEventOccurs, theEntityIsCreated, theEventIsSent, theEntityWithIdHasTheExpectedComponent, featureEventDescription, theEntityIsOnRepository, serverScenario, clientScenario, feature } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { Playable } from '../../Components/Playable'
import { EntityReference } from '../../Components/EntityReference'
import { createPlayerEvent, createSimpleMatchLobbyEvent, createRobotEvent, createTowerEvent, createMainMenuEvent, createGridEvent, createMatchEvent, createServerGameEvent, createClientGameEvent, createPlayerSimpleMatchLobbyButtonEvent, createPlayerNextTurnMatchButtonEvent } from './create'
import { registerGridEvent, registerRobotEvent, registerTowerEvent } from '../register/register'
import { showEvent } from '../show/show'
import { Dimensional } from '../../Components/Dimensional'
import { EntityType } from '../../Event/EntityType'
import { Hittable } from '../../Components/Hittable'
import { Offensive } from '../../Components/Offensive'
import { matchWaitingForPlayers } from '../waiting/waiting'
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
feature(featureEventDescription(Action.create), () => {
    clientScenario(`${Action.create} 1 - Create Game Event`, createClientGameEvent(EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, createClientGameEvent(EntityId.playerA)),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.game),
            (game, adapters) => theEntityIsCreated(TestStep.And, adapters, EntityId.game),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createMainMenuEvent(EntityId.game, 'unknown', EntityId.playerA))
        ],
        [EntityId.game])
    clientScenario(`${Action.create} 2 - Create Main Menu Event`, createMainMenuEvent(EntityId.game, EntityId.mainMenu, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, createMainMenuEvent(EntityId.game, EntityId.mainMenu, EntityId.playerA)),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.mainMenu),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.mainMenu),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA))
        ],
        [EntityId.mainMenu])
    serverScenario(`${Action.create} 4 - Create Game Event`, createServerGameEvent, undefined, [
        (game, adapters) => whenEventOccurs(game, createServerGameEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.game),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, createSimpleMatchLobbyEvent(EntityId.game, 'create'))
    ], [EntityId.game])
    serverScenario(`${Action.create} 5 - Create Player Event`, createPlayerEvent, undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerA),
        (game, adapters) => whenEventOccurs(game, createPlayerEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerA),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map()))
    ], [EntityId.playerA])
    serverScenario(`${Action.create} 6 - Create Simple Match Lobby Event`, createSimpleMatchLobbyEvent(EntityId.game, EntityId.simpleMatchLobby), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.simpleMatchLobby),
        (game, adapters) => whenEventOccurs(game, createSimpleMatchLobbyEvent(EntityId.game, EntityId.simpleMatchLobby)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.simpleMatchLobby),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, []))
    ], [EntityId.simpleMatchLobby])
    serverScenario(`${Action.create} 7 - Create Robot Event`, createRobotEvent(EntityId.playerA), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerARobot),
        (game, adapters) => whenEventOccurs(game, createRobotEvent(EntityId.playerA)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerARobot),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerRobotEvent(EntityId.playerARobot, EntityId.playerA)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Hittable, new Hittable(EntityId.playerARobot, 50)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Offensive, new Offensive(EntityId.playerARobot, 20))
    ], [EntityId.playerARobot])
    serverScenario(`${Action.create} 8 - Create Tower Event`, createTowerEvent(EntityId.playerA), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerBTower),
        (game, adapters) => whenEventOccurs(game, createTowerEvent(EntityId.playerA)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerBTower),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerTowerEvent(EntityId.playerBTower, EntityId.playerA)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Hittable, new Hittable(EntityId.playerBTower, 100)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Offensive, new Offensive(EntityId.playerBTower, 5))
    ], [EntityId.playerBTower])
    serverScenario(`${Action.create} 9 - Create Grid Event`, createGridEvent(EntityId.match), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.grid),
        (game, adapters) => whenEventOccurs(game, createGridEvent(EntityId.match)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.grid),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, Dimensional, new Dimensional(EntityId.grid, { x: 25, y: 25 })),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerGridEvent(EntityId.match, EntityId.grid))
    ], [EntityId.grid])
    serverScenario(`${Action.create} 10`, createMatchEvent(EntityId.simpleMatchLobby), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.match),
        (game, adapters) => whenEventOccurs(game, createMatchEvent(EntityId.simpleMatchLobby)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.match),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, matchWaitingForPlayers(EntityId.match, EntityId.simpleMatchLobby)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Playable, new Playable(EntityId.match, [])),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map())),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, preparingGamePhase))
    ], [EntityId.match])
    serverScenario(`${Action.create} 11 - Create Player Simple Match Lobby Button`, createPlayerSimpleMatchLobbyButtonEvent(), undefined, [
        (game, adapters) => whenEventOccurs(game, createGridEvent(EntityId.match))
    ], [], true)
    serverScenario(`${Action.create} 12 - Create Player Next Turn Match Button`, createPlayerNextTurnMatchButtonEvent(), undefined, [
        (game, adapters) => whenEventOccurs(game, createGridEvent(EntityId.match))
    ], [], true)
})
