import { describe } from 'mocha'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { gridId, matchId, playerAId, playerARobotId, simpleMatchLobbyEntityId, playerBTowerId } from '../../Event/entityIds'
import { featureEventDescription, serverScenario, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { EntityReference } from '../../Components/EntityReference'
import { Playable } from '../../Components/Playable'
import { Match } from '../../Entities/Match'
import { TestStep } from '../../Event/TestStep'
import { createMatchEvent, createPlayerEvent } from '../create/create'
import { registerTowerEvent, registerRobotEvent, registerGridEvent } from './register'
import { playerReadyForMatch } from '../ready/ready'
describe(featureEventDescription(Action.register), () => {
    serverScenario(`${Action.register} 1`, registerTowerEvent(playerBTowerId, playerAId), [playerAId],
        (game) => () => game.onGameEvent(createPlayerEvent), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, playerAId),
            (game, adapters) => whenEventOccurs(game, registerTowerEvent(playerBTowerId, playerAId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[EntityType.tower, [playerBTowerId]]])))
        ])
    serverScenario(`${Action.register} 2`, registerRobotEvent(playerARobotId, playerAId), [playerAId],
        (game) => () => game.onGameEvent(createPlayerEvent), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, playerAId),
            (game, adapters) => whenEventOccurs(game, registerRobotEvent(playerARobotId, playerAId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[EntityType.robot, [playerARobotId]]])))
        ])
    serverScenario(`${Action.register} 3`, [registerRobotEvent(playerARobotId, playerAId), registerTowerEvent(playerBTowerId, playerAId)], [playerAId],
        (game, adapters) => () => {
            const matchEntity = new Match(matchId)
            matchEntity.addComponent(new Playable(matchId, [playerAId]))
            adapters.entityInteractor.addEntity(matchEntity)
            return game.onGameEvent(createPlayerEvent)
        }, [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, playerAId),
            (game, adapters) => whenEventOccurs(game, registerRobotEvent(playerARobotId, playerAId)),
            (game, adapters) => whenEventOccurs(game, registerTowerEvent(playerBTowerId, playerAId)),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, playerReadyForMatch(matchId, playerAId))
        ])
    serverScenario(`${Action.register} 4`, registerGridEvent(matchId, gridId), [matchId],
        (game, adapters) => () => game.onGameEvent(createMatchEvent(simpleMatchLobbyEntityId)), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => whenEventOccurs(game, registerGridEvent(matchId, gridId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, EntityReference, new EntityReference(matchId, new Map([[EntityType.grid, [gridId]]])))
        ])
})
