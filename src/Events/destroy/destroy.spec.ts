
import { makeEntityReference } from '../../Components/EntityReference'
import { makeLifeCycle } from '../../Components/LifeCycle'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityIsNotOnRepository, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyCellEvent, destroyDefeatEvent, destroyGridEvent, destroyMatchEvent, destroyNextTurnButtonEvent, destroyRobotEvent, destroySimpleMatchLobbyMenuEvent, destroyTowerEvent, destroyVictoryEvent } from './destroy'

feature(featureEventDescription(Action.destroy), () => {
    serverScenario(`${Action.destroy} 1`, destroyMatchEvent(EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withLifeCycle().withEntityReferences(EntityType.match, new Map([[EntityType.grid, [EntityId.grid]], [EntityType.victory, [EntityId.victory]], [EntityType.defeat, [EntityId.defeat]], [EntityType.nextTurnButton, [EntityId.playerANextTurnButton, EntityId.playerBNextTurnButton]]])).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, makeLifeCycle(EntityId.match)),
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
            .buildEntity(EntityId.playerARobot).withLifeCycle().withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerARobot, makeLifeCycle(EntityId.playerARobot)),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.playerARobot),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.robot, []]])))
        ])
    serverScenario(`${Action.destroy} 3`, destroyTowerEvent(EntityId.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerATower).withLifeCycle().withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerATower, makeLifeCycle(EntityId.playerATower)),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.playerATower),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.tower, []]])))
        ])
    serverScenario(`${Action.destroy} 4`, destroyGridEvent(EntityId.grid),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityId.cellx0y0, EntityId.cellx1y1]]])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.grid),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.grid),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                destroyCellEvent(EntityId.cellx0y0),
                destroyCellEvent(EntityId.cellx1y1)
            ])
        ])
    serverScenario(`${Action.destroy} 5`, destroyCellEvent(EntityId.cellx0y0),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.cellx0y0).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.cellx0y0),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.cellx0y0)
        ])
    serverScenario(`${Action.destroy} 6`, destroyVictoryEvent(EntityId.victory),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.victory).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.victory),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.victory)
        ])
    serverScenario(`${Action.destroy} 7`, destroyDefeatEvent(EntityId.defeat),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.defeat).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.defeat),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.defeat)
        ])
    serverScenario(`${Action.destroy} 8`, destroyNextTurnButtonEvent(EntityId.playerANextTurnButton),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.nextTurnButton, [EntityId.playerANextTurnButton]]])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerANextTurnButton),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, [EntityId.playerANextTurnButton]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.playerANextTurnButton),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, []]])))
        ])
    serverScenario(`${Action.destroy} 9`, destroySimpleMatchLobbyMenuEvent(EntityId.playerASimpleMatchLobbyMenu),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerASimpleMatchLobbyMenu).withEntityReferences(EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityId.playerASimpleMatchLobbyMenu]]])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerASimpleMatchLobbyMenu),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerASimpleMatchLobbyMenu, makeEntityReference(EntityId.playerASimpleMatchLobbyMenu, EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityId.playerASimpleMatchLobbyMenu]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityId.playerASimpleMatchLobbyMenu),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, []]])))
        ])
})
