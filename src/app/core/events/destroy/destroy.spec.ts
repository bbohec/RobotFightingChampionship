import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { makeLifeCycle } from '../../ecs/components/LifeCycle'
import { position, makePhysical } from '../../ecs/components/Physical'
import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { ShapeType } from '../../type/ShapeType'
import { destroyMatchEvent, destroyGridEvent, destroyVictoryEvent, destroyDefeatEvent, destroyNextTurnButtonEvent, destroyRobotEvent, destroyTowerEvent, destroyCellEvent, destroySimpleMatchLobbyMenuEvent } from './destroy'

feature(EventKind.destroy, () => {
    serverScenario(`${EventKind.destroy} 1`, destroyMatchEvent(EntityIds.match),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeLifeCycle(EntityIds.match),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton, EntityIds.playerBNextTurnButton]]])),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, []]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [
                destroyGridEvent(EntityIds.grid),
                destroyVictoryEvent(EntityIds.victory),
                destroyDefeatEvent(EntityIds.defeat),
                destroyNextTurnButtonEvent(EntityIds.playerANextTurnButton),
                destroyNextTurnButtonEvent(EntityIds.playerBNextTurnButton)
            ])
        ])
    serverScenario(`${EventKind.destroy} 2`, destroyRobotEvent(EntityIds.playerARobot),
        [], [
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
    serverScenario(`${EventKind.destroy} 3`, destroyTowerEvent(EntityIds.playerATower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeLifeCycle(EntityIds.playerATower),
                makeEntityReference(EntityIds.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, []]]))
            ])
        ])
    serverScenario(`${EventKind.destroy} 4`, destroyGridEvent(EntityIds.grid),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ]),
            eventsAreSent(TestStep.Then, 'server', [
                destroyCellEvent(EntityIds.cellx0y0),
                destroyCellEvent(EntityIds.cellx1y1)
            ])
        ])
    serverScenario(`${EventKind.destroy} 5`, destroyCellEvent(EntityIds.cellx0y0),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.cellx0y0, position(0, 0), ShapeType.cell, false)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ])
        ])
    serverScenario(`${EventKind.destroy} 6`, destroyVictoryEvent(EntityIds.victory),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, false)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ])
        ])
    serverScenario(`${EventKind.destroy} 7`, destroyDefeatEvent(EntityIds.defeat),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [

            ])
        ])
    serverScenario(`${EventKind.destroy} 8`, destroyNextTurnButtonEvent(EntityIds.playerANextTurnButton),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, []]]))
            ])
        ])
    serverScenario(`${EventKind.destroy} 9`, destroySimpleMatchLobbyMenuEvent(EntityIds.playerASimpleMatchLobbyMenu),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerASimpleMatchLobbyMenu, EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, []]]))
            ])
        ])
})
