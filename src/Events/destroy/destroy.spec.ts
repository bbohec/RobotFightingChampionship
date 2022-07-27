
import { makeEntityReference } from '../../Components/EntityReference'
import { makeLifeCycle } from '../../Components/LifeCycle'
import { makePhysical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { serverScenario } from '../../test/scenario'
import { thereIsServerComponents } from '../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../test/unitTest/event'
import { TestStep } from '../../Event/TestStep'
import { destroyCellEvent, destroyDefeatEvent, destroyGridEvent, destroyMatchEvent, destroyNextTurnButtonEvent, destroyRobotEvent, destroySimpleMatchLobbyMenuEvent, destroyTowerEvent, destroyVictoryEvent } from './destroy'
import { feature } from '../../test/feature'

feature(Action.destroy, () => {
    serverScenario(`${Action.destroy} 1`, destroyMatchEvent(EntityIds.match),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withLifeCycle().withEntityReferences(EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton, EntityIds.playerBNextTurnButton]]])).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeLifeCycle(EntityIds.match),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton, EntityIds.playerBNextTurnButton]]])),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, []]]))
            ]),
            eventsAreSent(TestStep.And, 'server', [
                destroyGridEvent(EntityIds.grid),
                destroyVictoryEvent(EntityIds.victory),
                destroyDefeatEvent(EntityIds.defeat),
                destroyNextTurnButtonEvent(EntityIds.playerANextTurnButton),
                destroyNextTurnButtonEvent(EntityIds.playerBNextTurnButton)
            ])
        ])
    serverScenario(`${Action.destroy} 2`, destroyRobotEvent(EntityIds.playerARobot),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerARobot).withLifeCycle().withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeLifeCycle(EntityIds.playerARobot),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.robot, [EntityIds.playerARobot]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.robot, []]]))
            ])
        ])
    serverScenario(`${Action.destroy} 3`, destroyTowerEvent(EntityIds.playerATower),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerATower).withLifeCycle().withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeLifeCycle(EntityIds.playerATower),
                makeEntityReference(EntityIds.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, []]]))
            ])
        ])
    serverScenario(`${Action.destroy} 4`, destroyGridEvent(EntityIds.grid),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ]),
            eventsAreSent(TestStep.And, 'server', [
                destroyCellEvent(EntityIds.cellx0y0),
                destroyCellEvent(EntityIds.cellx1y1)
            ])
        ])
    serverScenario(`${Action.destroy} 5`, destroyCellEvent(EntityIds.cellx0y0),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.cellx0y0).withPhysical(position(0, 0), ShapeType.cell, false).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.cellx0y0, position(0, 0), ShapeType.cell, false)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ])
        ])
    serverScenario(`${Action.destroy} 6`, destroyVictoryEvent(EntityIds.victory),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.victory).withPhysical(position(0, 0), ShapeType.victory, false).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, false)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ])
        ])
    serverScenario(`${Action.destroy} 7`, destroyDefeatEvent(EntityIds.defeat),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.defeat).save()
        , [
            thereIsServerComponents(TestStep.Given, [

            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ])
        ])
    serverScenario(`${Action.destroy} 8`, destroyNextTurnButtonEvent(EntityIds.playerANextTurnButton),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])).save()
            .buildEntity(EntityIds.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
        , [
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, []]]))
            ])
        ])
    serverScenario(`${Action.destroy} 9`, destroySimpleMatchLobbyMenuEvent(EntityIds.playerASimpleMatchLobbyMenu),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerASimpleMatchLobbyMenu).withEntityReferences(EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])).save()
        , [
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerASimpleMatchLobbyMenu, EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, []]]))
            ])
        ])
})
