
import { makeEntityReference } from '../../Components/EntityReference'
import { makeLifeCycle } from '../../Components/LifeCycle'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityIsNotOnRepository, theEntityIsOnRepository, thereIsServerComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyCellEvent, destroyDefeatEvent, destroyGridEvent, destroyMatchEvent, destroyNextTurnButtonEvent, destroyRobotEvent, destroySimpleMatchLobbyMenuEvent, destroyTowerEvent, destroyVictoryEvent } from './destroy'

feature(featureEventDescription(Action.destroy), () => {
    serverScenario(`${Action.destroy} 1`, destroyMatchEvent(EntityIds.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withLifeCycle().withEntityReferences(EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton, EntityIds.playerBNextTurnButton]]])).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeLifeCycle(EntityIds.match)
            ]),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityIds.match),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                destroyGridEvent(EntityIds.grid),
                destroyVictoryEvent(EntityIds.victory),
                destroyDefeatEvent(EntityIds.defeat),
                destroyNextTurnButtonEvent(EntityIds.playerANextTurnButton),
                destroyNextTurnButtonEvent(EntityIds.playerBNextTurnButton)
            ])
        ])
    serverScenario(`${Action.destroy} 2`, destroyRobotEvent(EntityIds.playerARobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerARobot).withLifeCycle().withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeLifeCycle(EntityIds.playerARobot)
            ]),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityIds.playerARobot),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.robot, []]]))
            ])
        ])
    serverScenario(`${Action.destroy} 3`, destroyTowerEvent(EntityIds.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerATower).withLifeCycle().withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeLifeCycle(EntityIds.playerATower)
            ]),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityIds.playerATower),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, []]]))
            ])
        ])
    serverScenario(`${Action.destroy} 4`, destroyGridEvent(EntityIds.grid),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.grid),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityIds.grid),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                destroyCellEvent(EntityIds.cellx0y0),
                destroyCellEvent(EntityIds.cellx1y1)
            ])
        ])
    serverScenario(`${Action.destroy} 5`, destroyCellEvent(EntityIds.cellx0y0),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.cellx0y0).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.cellx0y0),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityIds.cellx0y0)
        ])
    serverScenario(`${Action.destroy} 6`, destroyVictoryEvent(EntityIds.victory),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.victory).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.victory),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityIds.victory)
        ])
    serverScenario(`${Action.destroy} 7`, destroyDefeatEvent(EntityIds.defeat),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.defeat).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.defeat),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityIds.defeat)
        ])
    serverScenario(`${Action.destroy} 8`, destroyNextTurnButtonEvent(EntityIds.playerANextTurnButton),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityIds.playerANextTurnButton),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityIds.playerANextTurnButton),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, []]]))
            ])
        ])
    serverScenario(`${Action.destroy} 9`, destroySimpleMatchLobbyMenuEvent(EntityIds.playerASimpleMatchLobbyMenu),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerASimpleMatchLobbyMenu).withEntityReferences(EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityIds.playerASimpleMatchLobbyMenu),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerASimpleMatchLobbyMenu, EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Then, adapters, EntityIds.playerASimpleMatchLobbyMenu),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, []]]))
            ])
        ])
})
