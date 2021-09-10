import { describe } from 'mocha'
import { EntityReference } from '../../Components/EntityReference'
import { Playable } from '../../Components/Playable'
import { Match } from '../../Entities/Match'
import { Player } from '../../Entities/Player'
import { Action } from '../../Event/Action'
import { mainMenuEntityId, matchId, playerAId, playerBId, playerARobotId, playerBRobotId, playerATowerId, playerBTowerId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsNotSent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../destroy/destroy'
import { showEvent } from '../show/show'
import { quitMatchEvent } from './quit'

describe(featureEventDescription(Action.quit), () => {
    serverScenario(`${Action.quit} 1`, quitMatchEvent(matchId, playerAId), undefined,
        (game, adapters) => () => {
            const match = new Match(matchId)
            match.addComponent(new Playable(matchId, [playerAId, playerBId]))
            adapters.entityInteractor.addEntity(match)
            const player = new Player(playerAId)
            player.addComponent(new EntityReference(playerAId, new Map([
                [EntityType.robot, [playerARobotId]],
                [EntityType.tower, [playerATowerId]]
            ])))
            adapters.entityInteractor.addEntity(player)
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Playable, new Playable(matchId, [playerAId, playerBId])),
            (game, adapters) => whenEventOccurs(game, quitMatchEvent(matchId, playerAId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Playable, new Playable(matchId, [playerBId])),
            (game, adapters) => theEventIsNotSent(TestStep.Then, adapters, destroyMatchEvent(matchId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, destroyRobotEvent(playerARobotId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, destroyTowerEvent(playerATowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.mainMenu, mainMenuEntityId, playerAId))
        ])
    serverScenario(`${Action.quit} 2`, quitMatchEvent(matchId, playerBId), undefined,
        (game, adapters) => () => {
            const match = new Match(matchId)
            match.addComponent(new Playable(matchId, [playerBId]))
            adapters.entityInteractor.addEntity(match)
            const player = new Player(playerBId)
            player.addComponent(new EntityReference(playerAId, new Map([
                [EntityType.robot, [playerBRobotId]],
                [EntityType.tower, [playerBTowerId]]
            ])))
            adapters.entityInteractor.addEntity(player)
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Playable, new Playable(matchId, [playerBId])),
            (game, adapters) => whenEventOccurs(game, quitMatchEvent(matchId, playerBId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Playable, new Playable(matchId, [])),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, destroyMatchEvent(matchId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, destroyRobotEvent(playerBRobotId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, destroyTowerEvent(playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.mainMenu, mainMenuEntityId, playerBId))
        ])
})
