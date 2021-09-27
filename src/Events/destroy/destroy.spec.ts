
import { LifeCycle } from '../../Components/LifeCycle'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { feature, featureEventDescription, serverScenario, theEntityIsNotOnRepository, theEntityWithIdHasTheExpectedComponent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from './destroy'

feature(featureEventDescription(Action.destroy), () => {
    serverScenario(`${Action.destroy} 1`, destroyMatchEvent(EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withLifeCycle().save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, LifeCycle, new LifeCycle(EntityId.match)),
            (game, adapters) => whenEventOccurs(game, destroyMatchEvent(EntityId.match)),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.match)
        ])
    serverScenario(`${Action.destroy} 2`, destroyRobotEvent(EntityId.playerARobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerARobot).withLifeCycle().save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerARobot, LifeCycle, new LifeCycle(EntityId.playerARobot)),
            (game, adapters) => whenEventOccurs(game, destroyRobotEvent(EntityId.playerARobot)),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.playerARobot)
        ])
    serverScenario(`${Action.destroy} 3`, destroyTowerEvent(EntityId.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerATower).withLifeCycle().save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerATower, LifeCycle, new LifeCycle(EntityId.playerATower)),
            (game, adapters) => whenEventOccurs(game, destroyTowerEvent(EntityId.playerATower)),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.playerATower)
        ])
})
