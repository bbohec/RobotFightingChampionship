import { describe } from 'mocha'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { gridId, matchId, playerAId, robotId, towerId } from '../../Event/entityIds'
import { featureEventDescription, serverScenario, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { EntityReference } from '../../Components/EntityReference'
import { Playable } from '../../Components/Playable'
import { Match } from '../../Entities/Match'
import { TestStep } from '../../Event/TestStep'
import { createMatchEvent, createPlayerEvent } from '../create/create'
import { registerTowerEvent, registerRobotEvent, registerGridEvent } from './register'
import { playerReadyForMatch } from '../ready/ready'
describe(featureEventDescription(Action.register), () => {
    serverScenario(registerTowerEvent(towerId, playerAId), [playerAId],
        (game) => () => game.onGameEvent(createPlayerEvent), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, playerAId),
            (game, adapters) => whenEventOccurs(game, registerTowerEvent(towerId, playerAId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[towerId, EntityType.tower]])))
        ])
    serverScenario(registerRobotEvent(robotId, playerAId), [playerAId],
        (game) => () => game.onGameEvent(createPlayerEvent), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, playerAId),
            (game, adapters) => whenEventOccurs(game, registerRobotEvent(robotId, playerAId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[robotId, EntityType.robot]])))
        ])
    serverScenario([registerRobotEvent(robotId, playerAId), registerTowerEvent(towerId, playerAId)], [playerAId],
        (game, adapters) => () => {
            const matchEntity = new Match(matchId)
            matchEntity.addComponent(new Playable(matchId, [playerAId]))
            adapters.entityInteractor.addEntity(matchEntity)
            return game.onGameEvent(createPlayerEvent)
        }, [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, playerAId),
            (game, adapters) => whenEventOccurs(game, registerRobotEvent(robotId, playerAId)),
            (game, adapters) => whenEventOccurs(game, registerTowerEvent(towerId, playerAId)),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, playerReadyForMatch(matchId, playerAId))
        ])
    serverScenario(registerGridEvent(matchId, gridId), [matchId],
        (game, adapters) => () => game.onGameEvent(createMatchEvent), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => whenEventOccurs(game, registerGridEvent(matchId, gridId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, EntityReference, new EntityReference(matchId, new Map([['gridId', EntityType.grid]])))
        ])
})
