import { describe } from 'mocha'
import { LifeCycle } from '../../Components/LifeCycle'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { matchId, playerARobotId, playerATowerId } from '../../Event/entityIds'
import { featureEventDescription, serverScenario, theEntityIsNotOnRepository, theEntityWithIdHasTheExpectedComponent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from './destroy'

describe(featureEventDescription(Action.destroy), () => {
    serverScenario(`${Action.destroy} 1`, destroyMatchEvent(matchId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withLifeCycle().save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, LifeCycle, new LifeCycle(matchId)),
            (game, adapters) => whenEventOccurs(game, destroyMatchEvent(matchId)),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, matchId)
        ])
    serverScenario(`${Action.destroy} 2`, destroyRobotEvent(playerARobotId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(playerARobotId).withLifeCycle().save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerARobotId, LifeCycle, new LifeCycle(playerARobotId)),
            (game, adapters) => whenEventOccurs(game, destroyRobotEvent(playerARobotId)),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, playerARobotId)
        ])
    serverScenario(`${Action.destroy} 3`, destroyTowerEvent(playerATowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(playerATowerId).withLifeCycle().save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerATowerId, LifeCycle, new LifeCycle(playerATowerId)),
            (game, adapters) => whenEventOccurs(game, destroyTowerEvent(playerATowerId)),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, playerATowerId)
        ])
})
