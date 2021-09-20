import { describe } from 'mocha'
import { Action } from '../../Event/Action'
import { theEntityIsNotOnRepository, whenEventOccurs, theEntityIsCreated, theEventIsSent, theEntityWithIdHasTheExpectedComponent, featureEventDescription, theEntityIsOnRepository, serverScenario, clientScenario } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { gridId, gameEntityId, mainMenuEntityId, matchId, playerAId, playerARobotId, simpleMatchLobbyEntityId, playerBTowerId } from '../../Event/entityIds'
import { Playable } from '../../Components/Playable'
import { EntityReference } from '../../Components/EntityReference'
import { createPlayerEvent, createSimpleMatchLobbyEvent, createRobotEvent, createTowerEvent, createMainMenuEvent, createGridEvent, createMatchEvent, createServerGameEvent, createClientGameEvent } from './create'
import { registerGridEvent, registerRobotEvent, registerTowerEvent } from '../register/register'
import { showEvent } from '../show/show'
import { Dimensional } from '../../Components/Dimensional'
import { EntityType } from '../../Event/EntityType'
import { Hittable } from '../../Components/Hittable'
import { Offensive } from '../../Components/Offensive'
import { matchWaitingForPlayers } from '../waiting/waiting'
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
import { EntityBuilder } from '../../Entities/entityBuilder'
describe(featureEventDescription(Action.create), () => {
    clientScenario(`${Action.create} 1 - Create Game Event`, createClientGameEvent(playerAId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(playerAId).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, playerAId),
            (game, adapters) => whenEventOccurs(game, createClientGameEvent(playerAId)),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, gameEntityId),
            (game, adapters) => theEntityIsCreated(TestStep.And, adapters, gameEntityId),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createMainMenuEvent(gameEntityId, 'unknown', playerAId))
        ],
        [gameEntityId])
    clientScenario(`${Action.create} 2 - Create Main Menu Event`, createMainMenuEvent(gameEntityId, mainMenuEntityId, playerAId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(playerAId).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, playerAId),
            (game, adapters) => whenEventOccurs(game, createMainMenuEvent(gameEntityId, mainMenuEntityId, playerAId)),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, mainMenuEntityId),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, mainMenuEntityId),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.mainMenu, mainMenuEntityId, playerAId))
        ],
        [mainMenuEntityId])
    serverScenario(`${Action.create} 4 - Create Game Event`, createServerGameEvent, undefined, [
        (game, adapters) => whenEventOccurs(game, createServerGameEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, gameEntityId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, createSimpleMatchLobbyEvent(gameEntityId, 'create'))
    ], [gameEntityId])
    serverScenario(`${Action.create} 5 - Create Player Event`, createPlayerEvent, undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, playerAId),
        (game, adapters) => whenEventOccurs(game, createPlayerEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, playerAId),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map()))
    ], [playerAId])
    serverScenario(`${Action.create} 6 - Create Simple Match Lobby Event`, createSimpleMatchLobbyEvent(gameEntityId, simpleMatchLobbyEntityId), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, simpleMatchLobbyEntityId),
        (game, adapters) => whenEventOccurs(game, createSimpleMatchLobbyEvent(gameEntityId, simpleMatchLobbyEntityId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, simpleMatchLobbyEntityId),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, []))
    ], [simpleMatchLobbyEntityId])
    serverScenario(`${Action.create} 7 - Create Robot Event`, createRobotEvent(playerAId), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, playerARobotId),
        (game, adapters) => whenEventOccurs(game, createRobotEvent(playerAId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, playerARobotId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerRobotEvent(playerARobotId, playerAId)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, Hittable, new Hittable(playerARobotId, 50)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, Offensive, new Offensive(playerARobotId, 20))
    ], [playerARobotId])
    serverScenario(`${Action.create} 8 - Create Tower Event`, createTowerEvent(playerAId), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, playerBTowerId),
        (game, adapters) => whenEventOccurs(game, createTowerEvent(playerAId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, playerBTowerId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerTowerEvent(playerBTowerId, playerAId)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 100)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Offensive, new Offensive(playerBTowerId, 5))
    ], [playerBTowerId])
    serverScenario(`${Action.create} 9 - Create Grid Event`, createGridEvent(matchId), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, gridId),
        (game, adapters) => whenEventOccurs(game, createGridEvent(matchId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, gridId),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, gridId, Dimensional, new Dimensional(gridId, { x: 25, y: 25 })),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerGridEvent(matchId, gridId))
    ], [gridId])
    serverScenario(`${Action.create} 10`, createMatchEvent(simpleMatchLobbyEntityId), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, matchId),
        (game, adapters) => whenEventOccurs(game, createMatchEvent(simpleMatchLobbyEntityId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, matchId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, matchWaitingForPlayers(matchId, simpleMatchLobbyEntityId)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Playable, new Playable(matchId, [])),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, EntityReference, new EntityReference(matchId, new Map())),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, preparingGamePhase()))
    ], [matchId])
})
