
import { EntityReference } from '../../Components/EntityReference'
import { defaultJoinSimpleMatchButtonPosition, mainMenuPosition, Physical } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, eventsAreSent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../destroy/destroy'
import { drawEvent } from '../show/draw'
import { quitMatchEvent } from './quit'

feature(featureEventDescription(Action.quit), () => {
    serverScenario(`${Action.quit} 1`, quitMatchEvent(EntityId.match, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
            .buildEntity(EntityId.playerAMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, false).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityId.playerARobot]], [EntityType.tower, [EntityId.playerATower]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                destroyRobotEvent(EntityId.playerARobot),
                destroyTowerEvent(EntityId.playerATower),
                drawEvent(EntityType.mainMenu, EntityId.playerAMainMenu, EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
                drawEvent(EntityType.button, EntityId.playerAJoinSimpleMatchButton, EntityId.playerA, new Physical(EntityId.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true))
            ])
        ])
    serverScenario(`${Action.quit} 2`, quitMatchEvent(EntityId.match, EntityId.playerB),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerB]]])).save()
            .buildEntity(EntityId.playerBMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, false).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityId.playerBRobot]], [EntityType.tower, [EntityId.playerBTower]], [EntityType.mainMenu, [EntityId.playerBMainMenu]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerB]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, []]]))),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [
                destroyRobotEvent(EntityId.playerBRobot),
                destroyTowerEvent(EntityId.playerBTower),
                drawEvent(EntityType.mainMenu, EntityId.playerBMainMenu, EntityId.playerB, new Physical(EntityId.playerBMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
                drawEvent(EntityType.button, EntityId.playerAJoinSimpleMatchButton, EntityId.playerA, new Physical(EntityId.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)),
                destroyMatchEvent(EntityId.match)
            ])
        ])
})
