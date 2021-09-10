import { describe } from 'mocha'
import { Action } from '../../Event/Action'
import { matchId, playerAId, playerBId, playerARobotId, playerBRobotId, simpleMatchLobbyEntityId, playerATowerId, playerBTowerId } from '../../Event/entityIds'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { Hittable } from '../../Components/Hittable'
import { hitEvent } from './hit'
import { createMatchEvent, createPlayerEvent, createRobotEvent, createTowerEvent } from '../create/create'
import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'
import { playerJoinMatchEvent } from '../join/join'
import { victoryEvent } from '../victory/victory'
describe(featureEventDescription(Action.hit), () => {
    serverScenario(`${Action.hit} 1 - Robot Hit Tower`, hitEvent(playerARobotId, playerBTowerId), [playerARobotId, playerBTowerId],
        (game, adapters) => () => game.onGameEvent(createRobotEvent(playerAId))
            .then(() => game.onGameEvent(createTowerEvent(playerBId)))
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 100)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 80))
        ])

    serverScenario(`${Action.hit} 2 - Robot Kill Tower`, hitEvent(playerARobotId, playerBTowerId), [matchId, playerAId, playerBId, playerARobotId, playerBTowerId],
        (game, adapters) => () =>
            game.onGameEvent(createMatchEvent(simpleMatchLobbyEntityId))
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerAId, matchId)))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerBId, matchId)))
                .then(() => game.onGameEvent(createRobotEvent(playerAId)))
                .then(() => game.onGameEvent(createTowerEvent(playerBId)))
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 100)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, EntityReference, new EntityReference(playerARobotId, new Map([[EntityType.player, [playerAId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, EntityReference, new EntityReference(playerBTowerId, new Map([[EntityType.player, [playerBId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[EntityType.match, [matchId]]]))),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 0)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, victoryEvent(matchId, playerAId))
        ])
    serverScenario(`${Action.hit} 3 - Robot Kill Robot`, hitEvent(playerARobotId, playerBRobotId), [matchId, playerAId, playerBId, playerARobotId, playerBRobotId],
        (game, adapters) => () =>
            game.onGameEvent(createMatchEvent(simpleMatchLobbyEntityId))
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerAId, matchId)))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerBId, matchId)))
                .then(() => game.onGameEvent(createRobotEvent(playerAId)))
                .then(() => game.onGameEvent(createRobotEvent(playerBId)))
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerBRobotId, Hittable, new Hittable(playerBRobotId, 50)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, EntityReference, new EntityReference(playerARobotId, new Map([[EntityType.player, [playerAId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, EntityReference, new EntityReference(playerBRobotId, new Map([[EntityType.player, [playerBId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[EntityType.match, [matchId]]]))),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBRobotId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBRobotId, Hittable, new Hittable(playerBRobotId, -10)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, victoryEvent(matchId, playerAId))
        ])
    serverScenario(`${Action.hit} 4 - Tower Kill Robot`, hitEvent(playerATowerId, playerBRobotId), [matchId, playerAId, playerBId, playerATowerId, playerBRobotId],
        (game, adapters) => () =>
            game.onGameEvent(createMatchEvent(simpleMatchLobbyEntityId))
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerAId, matchId)))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerBId, matchId)))
                .then(() => game.onGameEvent(createTowerEvent(playerAId)))
                .then(() => game.onGameEvent(createRobotEvent(playerBId)))
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerBRobotId, Hittable, new Hittable(playerBRobotId, 50)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, EntityReference, new EntityReference(playerATowerId, new Map([[EntityType.player, [playerAId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, EntityReference, new EntityReference(playerBRobotId, new Map([[EntityType.player, [playerBId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[EntityType.match, [matchId]]]))),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBRobotId, Hittable, new Hittable(playerBRobotId, 0)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, victoryEvent(matchId, playerAId))
        ])
    serverScenario(`${Action.hit} 5 - Tower Kill Tower`, hitEvent(playerBTowerId, playerATowerId), [matchId, playerAId, playerBId, playerATowerId, playerBTowerId],
        (game, adapters) => () =>
            game.onGameEvent(createMatchEvent(simpleMatchLobbyEntityId))
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerAId, matchId)))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerBId, matchId)))
                .then(() => game.onGameEvent(createTowerEvent(playerAId)))
                .then(() => game.onGameEvent(createTowerEvent(playerBId)))
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerATowerId, Hittable, new Hittable(playerATowerId, 100)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, EntityReference, new EntityReference(playerATowerId, new Map([[EntityType.player, [playerAId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, EntityReference, new EntityReference(playerBTowerId, new Map([[EntityType.player, [playerBId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBId, EntityReference, new EntityReference(playerBId, new Map([[EntityType.match, [matchId]]]))),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Hittable, new Hittable(playerATowerId, 0)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, victoryEvent(matchId, playerBId))
        ])
    serverScenario(`${Action.hit} 6 - Friendly Fire`, hitEvent(playerATowerId, playerBRobotId), [], undefined, [
        (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBRobotId))
    ], true)
})
