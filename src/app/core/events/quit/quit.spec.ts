import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { victoryPhase, makePhasing } from '../../ecs/components/Phasing'
import { mainMenuPosition, defaultJoinSimpleMatchButtonPosition, position, makePhysical } from '../../ecs/components/Physical'
import { EntityBuilder } from '../../ecs/entity'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { destroyRobotEvent, destroyTowerEvent, destroyMatchEvent } from '../destroy/destroy'
import { drawEvent } from '../draw/draw'
import { quitMatchEvent } from './quit'

feature(Action.quit, () => {
    serverScenario(`${Action.quit} 1`, quitMatchEvent(EntityIds.match, EntityIds.playerA),
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]]])).withPhase(victoryPhase(EntityIds.playerA)).save()
            .makeEntity(EntityIds.playerAMainMenu).withPhysical(mainMenuPosition, ShapeType.mainMenu, false).save()
            .makeEntity(EntityIds.playerAJoinSimpleMatchButton).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false).save()
            .makeEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([
                [EntityType.robot, [EntityIds.playerARobot]],
                [EntityType.tower, [EntityIds.playerATower]],
                [EntityType.mainMenu, [EntityIds.playerAMainMenu]],
                [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]],
                [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]],
                [EntityType.match, [EntityIds.match]]
            ])).save()
            .makeEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([
                [EntityType.robot, [EntityIds.playerBRobot]],
                [EntityType.tower, [EntityIds.playerBTower]],
                [EntityType.match, [EntityIds.match]]
            ])).save()
            .makeEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])).save()
            .makeEntity(EntityIds.cellx0y0).withPhysical(position(0, 0), ShapeType.cell, false).save()
            .makeEntity(EntityIds.cellx1y1).withPhysical(position(0, 1), ShapeType.cell, false).save()
            .makeEntity(EntityIds.playerANextTurnButton).withPhysical(position(24, 24), ShapeType.nextTurnButton, false).save()
            .makeEntity(EntityIds.playerARobot).withPhysical(position(0, 0), ShapeType.robot, false).save()
            .makeEntity(EntityIds.playerATower).withPhysical(position(0, 1), ShapeType.tower, false).save()
            .makeEntity(EntityIds.playerBTower).withPhysical(position(10, 10), ShapeType.tower, false).save()
            .makeEntity(EntityIds.playerBRobot).withPhysical(position(10, 11), ShapeType.robot, false).save()
            .makeEntity(EntityIds.victory).withPhysical(position(24, 24), ShapeType.victory, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false),
                makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([
                    [EntityType.robot, [EntityIds.playerARobot]],
                    [EntityType.tower, [EntityIds.playerATower]],
                    [EntityType.mainMenu, [EntityIds.playerAMainMenu]],
                    [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]],
                    [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]],
                    [EntityType.match, [EntityIds.match]]
                ])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([
                    [EntityType.robot, [EntityIds.playerBRobot]],
                    [EntityType.tower, [EntityIds.playerBTower]],
                    [EntityType.match, [EntityIds.match]]
                ])),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])),
                makePhysical(EntityIds.cellx0y0, position(0, 0), ShapeType.cell, false),
                makePhysical(EntityIds.cellx1y1, position(0, 1), ShapeType.cell, false),
                makePhysical(EntityIds.playerANextTurnButton, position(24, 24), ShapeType.nextTurnButton, false),
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, false),
                makePhysical(EntityIds.playerATower, position(0, 1), ShapeType.tower, false),
                makePhysical(EntityIds.playerBTower, position(10, 10), ShapeType.tower, false),
                makePhysical(EntityIds.playerBRobot, position(10, 11), ShapeType.robot, false),
                makePhysical(EntityIds.victory, position(24, 24), ShapeType.victory, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false),
                makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([
                    [EntityType.robot, [EntityIds.playerARobot]],
                    [EntityType.tower, [EntityIds.playerATower]],
                    [EntityType.mainMenu, [EntityIds.playerAMainMenu]],
                    [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]],
                    [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]],
                    [EntityType.match, [EntityIds.match]]
                ])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([
                    [EntityType.robot, [EntityIds.playerBRobot]],
                    [EntityType.tower, [EntityIds.playerBTower]],
                    [EntityType.match, [EntityIds.match]]
                ])),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])),
                makePhysical(EntityIds.cellx0y0, position(0, 0), ShapeType.cell, false),
                makePhysical(EntityIds.cellx1y1, position(0, 1), ShapeType.cell, false),
                makePhysical(EntityIds.playerANextTurnButton, position(24, 24), ShapeType.nextTurnButton, false),
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, false),
                makePhysical(EntityIds.playerATower, position(0, 1), ShapeType.tower, false),
                makePhysical(EntityIds.playerBTower, position(10, 10), ShapeType.tower, false),
                makePhysical(EntityIds.playerBRobot, position(10, 11), ShapeType.robot, false),
                makePhysical(EntityIds.victory, position(24, 24), ShapeType.victory, true)
            ]),
            eventsAreSent(TestStep.And, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, false)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerATower, position(0, 1), ShapeType.tower, false)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerATower, position(0, 1), ShapeType.tower, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerBRobot, position(10, 11), ShapeType.robot, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerBTower, position(10, 10), ShapeType.tower, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.cellx0y0, position(0, 0), ShapeType.cell, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.cellx1y1, position(0, 1), ShapeType.cell, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, position(24, 24), ShapeType.nextTurnButton, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.victory, position(24, 24), ShapeType.victory, false)),
                destroyRobotEvent(EntityIds.playerARobot),
                destroyTowerEvent(EntityIds.playerATower)
            ])
        ])
    serverScenario(`${Action.quit} 2`, quitMatchEvent(EntityIds.match, EntityIds.playerB),
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.defeat, [EntityIds.defeat]]])).withPhase(victoryPhase(EntityIds.playerA)).save()
            .makeEntity(EntityIds.playerBMainMenu).withPhysical(mainMenuPosition, ShapeType.mainMenu, false).save()
            .makeEntity(EntityIds.playerBJoinSimpleMatchButton).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false).save()
            .makeEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityIds.playerBRobot]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.mainMenu, [EntityIds.playerBMainMenu]], [EntityType.button, [EntityIds.playerBJoinSimpleMatchButton]], [EntityType.match, [EntityIds.match]], [EntityType.nextTurnButton, [EntityIds.playerBNextTurnButton]]])).save()
            .makeEntity(EntityIds.playerBTower).withPhysical(position(10, 10), ShapeType.tower, false).save()
            .makeEntity(EntityIds.playerBRobot).withPhysical(position(10, 11), ShapeType.robot, false).save()
            .makeEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])).save()
            .makeEntity(EntityIds.cellx0y0).withPhysical(position(0, 0), ShapeType.cell, false).save()
            .makeEntity(EntityIds.cellx1y1).withPhysical(position(0, 1), ShapeType.cell, false).save()
            .makeEntity(EntityIds.playerBNextTurnButton).withPhysical(position(24, 24), ShapeType.nextTurnButton, false).save()
            .makeEntity(EntityIds.defeat).withPhysical(position(24, 24), ShapeType.defeat, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.defeat, [EntityIds.defeat]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makePhysical(EntityIds.playerBMainMenu, mainMenuPosition, ShapeType.mainMenu, false),
                makePhysical(EntityIds.playerBJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.robot, [EntityIds.playerBRobot]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.mainMenu, [EntityIds.playerBMainMenu]], [EntityType.button, [EntityIds.playerBJoinSimpleMatchButton]], [EntityType.match, [EntityIds.match]], [EntityType.nextTurnButton, [EntityIds.playerBNextTurnButton]]])),
                makePhysical(EntityIds.playerBTower, position(10, 10), ShapeType.tower, false),
                makePhysical(EntityIds.playerBRobot, position(10, 11), ShapeType.robot, false),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])),
                makePhysical(EntityIds.cellx0y0, position(0, 0), ShapeType.cell, false),
                makePhysical(EntityIds.cellx1y1, position(0, 1), ShapeType.cell, false),
                makePhysical(EntityIds.playerBNextTurnButton, position(24, 24), ShapeType.nextTurnButton, false),
                makePhysical(EntityIds.defeat, position(24, 24), ShapeType.defeat, true)

            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, []], [EntityType.grid, [EntityIds.grid]], [EntityType.defeat, [EntityIds.defeat]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makePhysical(EntityIds.playerBMainMenu, mainMenuPosition, ShapeType.mainMenu, false),
                makePhysical(EntityIds.playerBJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.robot, [EntityIds.playerBRobot]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.mainMenu, [EntityIds.playerBMainMenu]], [EntityType.button, [EntityIds.playerBJoinSimpleMatchButton]], [EntityType.match, [EntityIds.match]], [EntityType.nextTurnButton, [EntityIds.playerBNextTurnButton]]])),
                makePhysical(EntityIds.playerBTower, position(10, 10), ShapeType.tower, false),
                makePhysical(EntityIds.playerBRobot, position(10, 11), ShapeType.robot, false),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])),
                makePhysical(EntityIds.cellx0y0, position(0, 0), ShapeType.cell, false),
                makePhysical(EntityIds.cellx1y1, position(0, 1), ShapeType.cell, false),
                makePhysical(EntityIds.playerBNextTurnButton, position(24, 24), ShapeType.nextTurnButton, false),
                makePhysical(EntityIds.defeat, position(24, 24), ShapeType.defeat, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBRobot, position(10, 11), ShapeType.robot, false)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBTower, position(10, 10), ShapeType.tower, false)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.cellx0y0, position(0, 0), ShapeType.cell, false)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.cellx1y1, position(0, 1), ShapeType.cell, false)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, position(24, 24), ShapeType.nextTurnButton, false)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.defeat, position(24, 24), ShapeType.defeat, false)),
                destroyRobotEvent(EntityIds.playerBRobot),
                destroyTowerEvent(EntityIds.playerBTower),
                destroyMatchEvent(EntityIds.match)
            ])
        ])
})
