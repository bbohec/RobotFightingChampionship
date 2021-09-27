import { EntityReference } from '../../Components/EntityReference'
import { Phasing, playerARobotPhase } from '../../Components/Phasing'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { attackEvent } from '../attack/attack'
import { joinSimpleMatchLobby } from '../join/join'
import { moveEvent } from '../move/move'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { collisionGameEvent } from './collision'

feature(featureEventDescription(Action.collision), () => {
    serverScenario(`${Action.move} 1 - Collision with player pointer &  player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.playerAJoinSimpleMatchButton]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityId.playerAPointer]], [EntityType.mainMenu, [EntityId.mainMenu]]])).save()
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerAJoinSimpleMatchButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityId.playerAPointer]], [EntityType.mainMenu, [EntityId.mainMenu]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAJoinSimpleMatchButton, EntityReference, new EntityReference(EntityId.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
            (game, adapters) => whenEventOccurs(game, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.playerAJoinSimpleMatchButton]]]))),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, joinSimpleMatchLobby(EntityId.playerA, EntityId.mainMenu, EntityId.simpleMatchLobby))
        ])
    serverScenario(`${Action.move} 2 - Collision with player pointer &  player end turn button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.playerEndTurnButton]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerEndTurnButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerEndTurnButton, EntityReference, new EntityReference(EntityId.playerEndTurnButton, EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.match, [EntityId.match]]]))),
            (game, adapters) => whenEventOccurs(game, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.playerEndTurnButton]]]))),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, nextTurnEvent(EntityId.match))
        ])
    serverScenario(`${Action.move} 3 - Collision with player pointer &  match cell`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityId.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => whenEventOccurs(game, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1]]]))),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx1y1))
        ])
    serverScenario(`${Action.move} 4 - Collision with player pointer &  match cell & Tower`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1, EntityId.playerBTower]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower, new Map([])).save()
            .buildEntity(EntityId.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, EntityReference, new EntityReference(EntityId.playerBTower, EntityType.tower, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => whenEventOccurs(game, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1, EntityId.playerBTower]]]))),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, attackEvent(EntityId.playerA, EntityId.playerARobot, EntityId.playerBTower))
        ])
    serverScenario(`${Action.move} 5 - Collision with player pointer &  match cell & Robot`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1, EntityId.playerBRobot]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityId.playerBRobot).withEntityReferences(EntityType.robot, new Map([])).save()
            .buildEntity(EntityId.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, EntityReference, new EntityReference(EntityId.playerBRobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => whenEventOccurs(game, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1, EntityId.playerBRobot]]]))),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, attackEvent(EntityId.playerA, EntityId.playerARobot, EntityId.playerBRobot))
        ])
})
