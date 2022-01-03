import { Controller } from '../../Components/Controller'
import { EntityReference } from '../../Components/EntityReference'
import { Phasing, playerARobotPhase, playerATowerPhase, victoryPhase } from '../../Components/Phasing'
import { position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { missingEntityId } from '../../Entities/infra/InMemoryEntityRepository'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, eventsAreSent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { attackEvent } from '../attack/attack'
import { joinSimpleMatchLobby } from '../join/join'
import { moveEvent } from '../move/move'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { notifyServerEvent } from '../notifyServer/notifyServer'
import { quitMatchEvent } from '../quit/quit'
import { collisionGameEvent } from './collision'

feature(featureEventDescription(Action.collision), () => {
    serverScenario(`${Action.collision} 1 - Collision with player activated pointer &  player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.playerAJoinSimpleMatchButton]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityId.playerAPointer]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]])).save()
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.playerAJoinSimpleMatchButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityId.playerAPointer]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Active)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAJoinSimpleMatchButton, EntityReference, new EntityReference(EntityId.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [joinSimpleMatchLobby(EntityId.playerA, EntityId.playerAMainMenu, EntityId.simpleMatchLobby)]),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Idle))
        ])
    serverScenario(`${Action.collision} 2 - Collision with player idle pointer &  player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.playerAJoinSimpleMatchButton]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityId.playerAPointer]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]])).save()
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Idle).save()
            .buildEntity(EntityId.playerAJoinSimpleMatchButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityId.playerAPointer]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Idle)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAJoinSimpleMatchButton, EntityReference, new EntityReference(EntityId.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Idle))
        ])
    serverScenario(`${Action.collision} 3 - Collision with player pointer &  player end turn button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.playerANextTurnButton]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, EntityReference, new EntityReference(EntityId.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.match, [EntityId.match]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [nextTurnEvent(EntityId.match)])
        ])
    serverScenario(`${Action.collision} 4 - Collision with player pointer &  match cell`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
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
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx1y1)])
        ])
    serverScenario(`${Action.collision} 5 - Collision with player pointer &  match cell & Tower`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1, EntityId.playerBTower]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.grid, [EntityId.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityId.playerB]]])).save()
            .buildEntity(EntityId.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, EntityReference, new EntityReference(EntityId.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [attackEvent(EntityId.playerA, EntityId.playerARobot, EntityId.playerBTower)])
        ])
    serverScenario(`${Action.collision} 6 - Collision with player pointer &  match cell & Robot`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1, EntityId.playerBRobot]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.grid, [EntityId.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityId.playerBRobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityId.playerB]]])).save()
            .buildEntity(EntityId.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, EntityReference, new EntityReference(EntityId.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [attackEvent(EntityId.playerA, EntityId.playerARobot, EntityId.playerBRobot)])
        ])
    serverScenario(`${Action.collision} 7 - Collision with 2 player activated pointer &  2 player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.playerAJoinSimpleMatchButton, EntityId.playerBPointer, EntityId.playerBJoinSimpleMatchButton]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityId.playerAPointer]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityId.playerBJoinSimpleMatchButton]], [EntityType.pointer, [EntityId.playerBPointer]], [EntityType.mainMenu, [EntityId.playerBMainMenu]]])).save()
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.playerBPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerB]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.playerAJoinSimpleMatchButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])).save()
            .buildEntity(EntityId.playerBJoinSimpleMatchButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityId.playerB]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityId.playerAPointer]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Active)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBPointer, Controller, new Controller(EntityId.playerBPointer, ControlStatus.Active)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAJoinSimpleMatchButton, EntityReference, new EntityReference(EntityId.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [
                joinSimpleMatchLobby(EntityId.playerA, EntityId.playerAMainMenu, EntityId.simpleMatchLobby),
                joinSimpleMatchLobby(EntityId.playerB, EntityId.playerBMainMenu, EntityId.simpleMatchLobby)
            ]),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Idle)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBPointer, Controller, new Controller(EntityId.playerBPointer, ControlStatus.Idle))
        ])
    serverScenario(`${Action.collision} 8 - Collision with player activated pointer and visible defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.defeat]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.defeat).withEntityReferences(EntityType.defeat, new Map([[EntityType.match, [EntityId.match]], [EntityType.player, [EntityId.playerA]]])).withPhysicalComponent(position(0, 0), ShapeType.defeat, true).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [
                quitMatchEvent(EntityId.match, EntityId.playerA)
            ])
        ])
    serverScenario(`${Action.collision} 9 - Collision with player activated pointer and invisible defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.defeat]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.defeat).withEntityReferences(EntityType.defeat, new Map([[EntityType.match, [EntityId.match]]])).withPhysicalComponent(position(0, 0), ShapeType.defeat, false).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 10 - Collision with player activated pointer and visible victory`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerBPointer, EntityId.victory]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerBPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerB]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.victory).withEntityReferences(EntityType.victory, new Map([[EntityType.match, [EntityId.match]], [EntityType.player, [EntityId.playerB]]])).withPhysicalComponent(position(0, 0), ShapeType.victory, true).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerB]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [
                quitMatchEvent(EntityId.match, EntityId.playerB)
            ])
        ])
    serverScenario(`${Action.collision} 11 - Collision with player activated pointer and invisible victory`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerBPointer, EntityId.victory]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerBPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerB]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.victory).withEntityReferences(EntityType.victory, new Map([[EntityType.match, [EntityId.match]]])).withPhysicalComponent(position(0, 0), ShapeType.victory, false).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerB]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 12 - Collision with player pointer &  match cell & Robot on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1, EntityId.playerBRobot]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]])).withPhase(victoryPhase(EntityId.playerA)).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityId.playerBRobot).withEntityReferences(EntityType.robot, new Map([])).save()
            .buildEntity(EntityId.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, victoryPhase(EntityId.playerA))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, EntityReference, new EntityReference(EntityId.playerBRobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 13 - Collision with player pointer &  match cell & Tower on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1, EntityId.playerBTower]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]])).withPhase(victoryPhase(EntityId.playerA)).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower, new Map([])).save()
            .buildEntity(EntityId.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, victoryPhase(EntityId.playerA))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, EntityReference, new EntityReference(EntityId.playerBTower, EntityType.tower, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 14 - Collision with player pointer &  player end turn button on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.playerANextTurnButton]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.match).withPhase(victoryPhase(EntityId.playerA)).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, victoryPhase(EntityId.playerA))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, EntityReference, new EntityReference(EntityId.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.match, [EntityId.match]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 15 - Collision with player pointer &  match cell on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]])).withPhase(victoryPhase(EntityId.playerA)).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityId.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, victoryPhase(EntityId.playerA))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 16 - Collision with victory player activated pointer and visible victory & defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerBPointer, EntityId.victory, EntityId.defeat]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerBPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerB]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.defeat).withEntityReferences(EntityType.defeat, new Map([[EntityType.match, [EntityId.match]], [EntityType.player, [EntityId.playerA]]])).withPhysicalComponent(position(0, 0), ShapeType.defeat, true).save()
            .buildEntity(EntityId.victory).withEntityReferences(EntityType.victory, new Map([[EntityType.match, [EntityId.match]], [EntityType.player, [EntityId.playerB]]])).withPhysicalComponent(position(0, 0), ShapeType.victory, true).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerB]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [quitMatchEvent(EntityId.match, EntityId.playerB)])
        ])
    serverScenario(`${Action.collision} 16 - Collision with defeat player activated pointer and visible victory & defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.victory, EntityId.defeat]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.defeat).withEntityReferences(EntityType.defeat, new Map([[EntityType.match, [EntityId.match]], [EntityType.player, [EntityId.playerA]]])).withPhysicalComponent(position(0, 0), ShapeType.defeat, true).save()
            .buildEntity(EntityId.victory).withEntityReferences(EntityType.victory, new Map([[EntityType.match, [EntityId.match]], [EntityType.player, [EntityId.playerB]]])).withPhysicalComponent(position(0, 0), ShapeType.victory, true).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [quitMatchEvent(EntityId.match, EntityId.playerA)])
        ])
    serverScenario(`${Action.collision} 17 - Do nothing on collision with destroyed entities`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.cellx0y0, EntityId.playerATower]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.cellx0y0).withEntityReferences(EntityType.cell).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [notifyServerEvent(missingEntityId(EntityId.playerATower))])
        ])
    serverScenario(`${Action.collision} 18 - Collision with player pointer &  match cell & Tower & Other Match Tower`, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerAPointer, EntityId.cellx1y1, EntityId.playerBTower, EntityId.playerCTower]]])),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.grid, [EntityId.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityId.playerB]]])).save()
            .buildEntity(EntityId.playerCTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityId.playerC]]])).save()
            .buildEntity(EntityId.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]], [EntityType.cell, [EntityId.cellx1y1]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, EntityReference, new EntityReference(EntityId.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [attackEvent(EntityId.playerA, EntityId.playerARobot, EntityId.playerBTower)])
        ])
})
