import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { makeLifeCycle } from '../../ecs/components/LifeCycle'
import { position, makePhysical } from '../../ecs/components/Physical'
import { EntityBuilder } from '../../ecs/entity'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { destroyMatchEvent, destroyGridEvent, destroyVictoryEvent, destroyDefeatEvent, destroyNextTurnButtonEvent, destroyRobotEvent, destroyTowerEvent, destroyCellEvent, destroySimpleMatchLobbyMenuEvent } from './destroy'

feature(Action.destroy, () => {
    serverScenario(`${Action.destroy} 1`, destroyMatchEvent(EntityIds.match),
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.match).withLifeCycle().withEntityReferences(EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton, EntityIds.playerBNextTurnButton]]])).save()
            .makeEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]]])).save()
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
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.playerARobot).withLifeCycle().withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .makeEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityIds.playerARobot]]])).save()
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
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.playerATower).withLifeCycle().withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .makeEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]]])).save()
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
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])).save()
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
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.cellx0y0).withPhysical(position(0, 0), ShapeType.cell, false).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.cellx0y0, position(0, 0), ShapeType.cell, false)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ])
        ])
    serverScenario(`${Action.destroy} 6`, destroyVictoryEvent(EntityIds.victory),
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.victory).withPhysical(position(0, 0), ShapeType.victory, false).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, false)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ])
        ])
    serverScenario(`${Action.destroy} 7`, destroyDefeatEvent(EntityIds.defeat),
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.defeat).withPhysical(position(0, 0), ShapeType.defeat, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ])
        ])
    serverScenario(`${Action.destroy} 8`, destroyNextTurnButtonEvent(EntityIds.playerANextTurnButton),
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])).save()
            .makeEntity(EntityIds.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
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
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.playerASimpleMatchLobbyMenu).withEntityReferences(EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .makeEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])).save()
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
