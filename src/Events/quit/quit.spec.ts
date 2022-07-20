
import { makeEntityReference } from '../../Components/EntityReference'
import { victoryPhase } from '../../Components/Phasing'
import { defaultJoinSimpleMatchButtonPosition, mainMenuPosition, makePhysical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, thereIsServerComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../destroy/destroy'
import { drawEvent } from '../draw/draw'
import { quitMatchEvent } from './quit'

feature(featureEventDescription(Action.quit), () => {
    serverScenario(`${Action.quit} 1`, quitMatchEvent(EntityIds.match, EntityIds.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]]])).withPhase(victoryPhase(EntityIds.playerA)).save()
            .buildEntity(EntityIds.playerAMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, false).save()
            .buildEntity(EntityIds.playerAJoinSimpleMatchButton).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([
                [EntityType.robot, [EntityIds.playerARobot]],
                [EntityType.tower, [EntityIds.playerATower]],
                [EntityType.mainMenu, [EntityIds.playerAMainMenu]],
                [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]],
                [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]],
                [EntityType.match, [EntityIds.match]]
            ])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([
                [EntityType.robot, [EntityIds.playerBRobot]],
                [EntityType.tower, [EntityIds.playerBTower]],
                [EntityType.match, [EntityIds.match]]
            ])).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])).save()
            .buildEntity(EntityIds.cellx0y0).withPhysicalComponent(position(0, 0), ShapeType.cell, false).save()
            .buildEntity(EntityIds.cellx1y1).withPhysicalComponent(position(0, 1), ShapeType.cell, false).save()
            .buildEntity(EntityIds.playerANextTurnButton).withPhysicalComponent(position(24, 24), ShapeType.nextTurnButton, false).save()
            .buildEntity(EntityIds.playerARobot).withPhysicalComponent(position(0, 0), ShapeType.robot, false).save()
            .buildEntity(EntityIds.playerATower).withPhysicalComponent(position(0, 1), ShapeType.tower, false).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(10, 10), ShapeType.tower, false).save()
            .buildEntity(EntityIds.playerBRobot).withPhysicalComponent(position(10, 11), ShapeType.robot, false).save()
            .buildEntity(EntityIds.victory).withPhysicalComponent(position(24, 24), ShapeType.victory, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.victory, [EntityIds.victory]]]))
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
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
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.defeat, [EntityIds.defeat]]])).withPhase(victoryPhase(EntityIds.playerA)).save()
            .buildEntity(EntityIds.playerBMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, false).save()
            .buildEntity(EntityIds.playerBJoinSimpleMatchButton).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityIds.playerBRobot]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.mainMenu, [EntityIds.playerBMainMenu]], [EntityType.button, [EntityIds.playerBJoinSimpleMatchButton]], [EntityType.match, [EntityIds.match]], [EntityType.nextTurnButton, [EntityIds.playerBNextTurnButton]]])).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(10, 10), ShapeType.tower, false).save()
            .buildEntity(EntityIds.playerBRobot).withPhysicalComponent(position(10, 11), ShapeType.robot, false).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1]]])).save()
            .buildEntity(EntityIds.cellx0y0).withPhysicalComponent(position(0, 0), ShapeType.cell, false).save()
            .buildEntity(EntityIds.cellx1y1).withPhysicalComponent(position(0, 1), ShapeType.cell, false).save()
            .buildEntity(EntityIds.playerBNextTurnButton).withPhysicalComponent(position(24, 24), ShapeType.nextTurnButton, false).save()
            .buildEntity(EntityIds.defeat).withPhysicalComponent(position(24, 24), ShapeType.defeat, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]], [EntityType.defeat, [EntityIds.defeat]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, []], [EntityType.grid, [EntityIds.grid]], [EntityType.defeat, [EntityIds.defeat]]]))
            ]),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [
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
