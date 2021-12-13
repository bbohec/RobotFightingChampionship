
import { LifeCycle } from '../../Components/LifeCycle'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityIsNotOnRepository, theEntityWithIdHasTheExpectedComponent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyCellEvent, destroyDefeatEvent, destroyGridEvent, destroyMatchEvent, destroyNextTurnButtonEvent, destroyRobotEvent, destroyTowerEvent, destroyVictoryEvent } from './destroy'

feature(featureEventDescription(Action.destroy), () => {
    serverScenario(`${Action.destroy} 1`, destroyMatchEvent(EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withLifeCycle().save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, LifeCycle, new LifeCycle(EntityId.match)),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.match),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                destroyGridEvent(EntityId.grid),
                destroyVictoryEvent(EntityId.victory),
                destroyDefeatEvent(EntityId.defeat),
                destroyNextTurnButtonEvent(EntityId.playerANextTurnButton),
                destroyNextTurnButtonEvent(EntityId.playerBNextTurnButton)
            ])
        ])
    serverScenario(`${Action.destroy} 2`, destroyRobotEvent(EntityId.playerARobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerARobot).withLifeCycle().save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerARobot, LifeCycle, new LifeCycle(EntityId.playerARobot)),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.playerARobot)
        ])
    serverScenario(`${Action.destroy} 3`, destroyTowerEvent(EntityId.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerATower).withLifeCycle().save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerATower, LifeCycle, new LifeCycle(EntityId.playerATower)),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.playerATower)
        ])
    serverScenario(`${Action.destroy} 4`, destroyGridEvent(EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.match),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                destroyCellEvent(EntityId.cellx0y0),
                destroyCellEvent(EntityId.cellx1y1)
            ])
        ])
    serverScenario(`${Action.destroy} 5`, destroyCellEvent(EntityId.cellx0y0),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured()
        ])
    serverScenario(`${Action.destroy} 6`, destroyVictoryEvent(EntityId.victory),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured()
        ])
    serverScenario(`${Action.destroy} 6`, destroyDefeatEvent(EntityId.defeat),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured()
        ])
    serverScenario(`${Action.destroy} 7`, destroyNextTurnButtonEvent(EntityId.playerANextTurnButton),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured()
        ])
})
