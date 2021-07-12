import { describe } from 'mocha'
import { Action } from '../port/Action'
import { matchId, playerAId, playerBId, robotId, towerId } from '../port/entityIds'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../port/test'
import { TestStep } from '../port/TestStep'
import { Hittable } from '../../Component/Hittable'
import { robotHitTowerEvent } from './hit'
import { createMatchEvent, createPlayerEvent, createRobotEvent, createTowerEvent } from '../create/create'
import { EntityReference } from '../../Component/EntityReference'
import { EntityType } from '../port/EntityType'
import { playerJoinMatchEvent } from '../join/join'
import { victoryEvent } from '../victory/victory'
describe(featureEventDescription(Action.hit), () => {
    serverScenario(robotHitTowerEvent(robotId, towerId), [robotId, towerId],
        (game, adapters) => () => game.onGameEvent(createRobotEvent(playerAId))
            .then(() => game.onGameEvent(createTowerEvent(playerBId))),
        [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, towerId, Hittable, new Hittable(towerId, 100)),
            (game, adapters) => whenEventOccurs(game, robotHitTowerEvent(robotId, towerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, towerId, Hittable, new Hittable(towerId, 80))
        ])

    serverScenario(robotHitTowerEvent(robotId, towerId), [matchId, playerAId, playerBId, robotId, towerId],
        (game, adapters) => () =>
            game.onGameEvent(createMatchEvent)
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(createPlayerEvent))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerAId, matchId)))
                .then(() => game.onGameEvent(playerJoinMatchEvent(playerBId, matchId)))
                .then(() => game.onGameEvent(createRobotEvent(playerAId)))
                .then(() => game.onGameEvent(createTowerEvent(playerBId))),
        [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, towerId, Hittable, new Hittable(towerId, 100)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, robotId, EntityReference, new EntityReference(robotId, new Map([[playerAId, EntityType.player]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, towerId, EntityReference, new EntityReference(towerId, new Map([[playerBId, EntityType.player]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[matchId, EntityType.match]]))),
            (game, adapters) => whenEventOccurs(game, robotHitTowerEvent(robotId, towerId)),
            (game, adapters) => whenEventOccurs(game, robotHitTowerEvent(robotId, towerId)),
            (game, adapters) => whenEventOccurs(game, robotHitTowerEvent(robotId, towerId)),
            (game, adapters) => whenEventOccurs(game, robotHitTowerEvent(robotId, towerId)),
            (game, adapters) => whenEventOccurs(game, robotHitTowerEvent(robotId, towerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, towerId, Hittable, new Hittable(towerId, 0)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, victoryEvent(matchId, playerAId))

        ])
})
