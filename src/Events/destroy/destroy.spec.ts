import { describe } from 'mocha'
import { LifeCycle } from '../../Components/LifeCycle'
import { Match } from '../../Entities/Match'
import { Robot } from '../../Entities/Robot'
import { Tower } from '../../Entities/Tower'
import { Action } from '../../Event/Action'
import { matchId, playerARobotId, playerATowerId } from '../../Event/entityIds'
import { featureEventDescription, serverScenario, theEntityIsNotOnRepository, theEntityWithIdHasTheExpectedComponent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from './destroy'

describe(featureEventDescription(Action.destroy), () => {
    serverScenario(`${Action.destroy} 1`, destroyMatchEvent(matchId), undefined,
        (game, adapters) => () => {
            const match = new Match(matchId)
            match.addComponent(new LifeCycle(matchId))
            adapters.entityInteractor.addEntity(match)
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, LifeCycle, new LifeCycle(matchId)),
            (game, adapters) => whenEventOccurs(game, destroyMatchEvent(matchId)),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, matchId)
        ])
    serverScenario(`${Action.destroy} 2`, destroyRobotEvent(playerARobotId), undefined,
        (game, adapters) => () => {
            const robot = new Robot(playerARobotId)
            robot.addComponent(new LifeCycle(playerARobotId))
            adapters.entityInteractor.addEntity(robot)
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerARobotId, LifeCycle, new LifeCycle(playerARobotId)),
            (game, adapters) => whenEventOccurs(game, destroyRobotEvent(playerARobotId)),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, playerARobotId)
        ])
    serverScenario(`${Action.destroy} 3`, destroyTowerEvent(playerATowerId), undefined,
        (game, adapters) => () => {
            const tower = new Tower(playerATowerId)
            tower.addComponent(new LifeCycle(playerATowerId))
            adapters.entityInteractor.addEntity(tower)
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerATowerId, LifeCycle, new LifeCycle(playerATowerId)),
            (game, adapters) => whenEventOccurs(game, destroyTowerEvent(playerATowerId)),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, playerATowerId)
        ])
})
