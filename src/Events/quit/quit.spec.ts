
import { makeEntityReference } from '../../Components/EntityReference'
import { victoryPhase } from '../../Components/Phasing'
import { defaultJoinSimpleMatchButtonPosition, mainMenuPosition, makePhysical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../destroy/destroy'
import { drawEvent } from '../draw/draw'
import { quitMatchEvent } from './quit'

feature(featureEventDescription(Action.quit), () => {
    serverScenario(`${Action.quit} 1`, quitMatchEvent(EntityId.match, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.grid, [EntityId.grid]], [EntityType.victory, [EntityId.victory]]])).withPhase(victoryPhase(EntityId.playerA)).save()
            .buildEntity(EntityId.playerAMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, false).save()
            .buildEntity(EntityId.playerAJoinSimpleMatchButton).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([
                [EntityType.robot, [EntityId.playerARobot]],
                [EntityType.tower, [EntityId.playerATower]],
                [EntityType.mainMenu, [EntityId.playerAMainMenu]],
                [EntityType.button, [EntityId.playerAJoinSimpleMatchButton]],
                [EntityType.nextTurnButton, [EntityId.playerANextTurnButton]],
                [EntityType.match, [EntityId.match]]
            ])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([
                [EntityType.robot, [EntityId.playerBRobot]],
                [EntityType.tower, [EntityId.playerBTower]],
                [EntityType.match, [EntityId.match]]
            ])).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityId.cellx0y0, EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.cellx0y0).withPhysicalComponent(position(0, 0), ShapeType.cell, false).save()
            .buildEntity(EntityId.cellx1y1).withPhysicalComponent(position(0, 1), ShapeType.cell, false).save()
            .buildEntity(EntityId.playerANextTurnButton).withPhysicalComponent(position(24, 24), ShapeType.nextTurnButton, false).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(position(0, 0), ShapeType.robot, false).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(0, 1), ShapeType.tower, false).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(10, 10), ShapeType.tower, false).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(10, 11), ShapeType.robot, false).save()
            .buildEntity(EntityId.victory).withPhysicalComponent(position(24, 24), ShapeType.victory, true).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, makeEntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.grid, [EntityId.grid]], [EntityType.victory, [EntityId.victory]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, makeEntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerB]], [EntityType.grid, [EntityId.grid]], [EntityType.victory, [EntityId.victory]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityId.playerA, makePhysical(EntityId.playerARobot, position(0, 0), ShapeType.robot, false)),
                drawEvent(EntityId.playerB, makePhysical(EntityId.playerARobot, position(0, 0), ShapeType.robot, false)),
                drawEvent(EntityId.playerA, makePhysical(EntityId.playerATower, position(0, 1), ShapeType.tower, false)),
                drawEvent(EntityId.playerB, makePhysical(EntityId.playerATower, position(0, 1), ShapeType.tower, false)),
                drawEvent(EntityId.playerA, makePhysical(EntityId.playerBRobot, position(10, 11), ShapeType.robot, false)),
                drawEvent(EntityId.playerA, makePhysical(EntityId.playerBTower, position(10, 10), ShapeType.tower, false)),
                drawEvent(EntityId.playerA, makePhysical(EntityId.cellx0y0, position(0, 0), ShapeType.cell, false)),
                drawEvent(EntityId.playerA, makePhysical(EntityId.cellx1y1, position(0, 1), ShapeType.cell, false)),
                drawEvent(EntityId.playerA, makePhysical(EntityId.playerANextTurnButton, position(24, 24), ShapeType.nextTurnButton, false)),
                drawEvent(EntityId.playerA, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
                drawEvent(EntityId.playerA, makePhysical(EntityId.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)),
                drawEvent(EntityId.playerA, makePhysical(EntityId.victory, position(24, 24), ShapeType.victory, false)),
                destroyRobotEvent(EntityId.playerARobot),
                destroyTowerEvent(EntityId.playerATower)
            ])
        ])
    serverScenario(`${Action.quit} 2`, quitMatchEvent(EntityId.match, EntityId.playerB),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerB]], [EntityType.grid, [EntityId.grid]], [EntityType.defeat, [EntityId.defeat]]])).withPhase(victoryPhase(EntityId.playerA)).save()
            .buildEntity(EntityId.playerBMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, false).save()
            .buildEntity(EntityId.playerBJoinSimpleMatchButton).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityId.playerBRobot]], [EntityType.tower, [EntityId.playerBTower]], [EntityType.mainMenu, [EntityId.playerBMainMenu]], [EntityType.button, [EntityId.playerBJoinSimpleMatchButton]], [EntityType.match, [EntityId.match]], [EntityType.nextTurnButton, [EntityId.playerBNextTurnButton]]])).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(10, 10), ShapeType.tower, false).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(10, 11), ShapeType.robot, false).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityId.cellx0y0, EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.cellx0y0).withPhysicalComponent(position(0, 0), ShapeType.cell, false).save()
            .buildEntity(EntityId.cellx1y1).withPhysicalComponent(position(0, 1), ShapeType.cell, false).save()
            .buildEntity(EntityId.playerBNextTurnButton).withPhysicalComponent(position(24, 24), ShapeType.nextTurnButton, false).save()
            .buildEntity(EntityId.defeat).withPhysicalComponent(position(24, 24), ShapeType.defeat, true).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, makeEntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerB]], [EntityType.grid, [EntityId.grid]], [EntityType.defeat, [EntityId.defeat]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, makeEntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, []], [EntityType.grid, [EntityId.grid]], [EntityType.defeat, [EntityId.defeat]]]))),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [
                drawEvent(EntityId.playerB, makePhysical(EntityId.playerBRobot, position(10, 11), ShapeType.robot, false)),
                drawEvent(EntityId.playerB, makePhysical(EntityId.playerBTower, position(10, 10), ShapeType.tower, false)),
                drawEvent(EntityId.playerB, makePhysical(EntityId.cellx0y0, position(0, 0), ShapeType.cell, false)),
                drawEvent(EntityId.playerB, makePhysical(EntityId.cellx1y1, position(0, 1), ShapeType.cell, false)),
                drawEvent(EntityId.playerB, makePhysical(EntityId.playerBNextTurnButton, position(24, 24), ShapeType.nextTurnButton, false)),
                drawEvent(EntityId.playerB, makePhysical(EntityId.playerBMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
                drawEvent(EntityId.playerB, makePhysical(EntityId.playerBJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)),
                drawEvent(EntityId.playerB, makePhysical(EntityId.defeat, position(24, 24), ShapeType.defeat, false)),
                destroyRobotEvent(EntityId.playerBRobot),
                destroyTowerEvent(EntityId.playerBTower),
                destroyMatchEvent(EntityId.match)
            ])
        ])
})
