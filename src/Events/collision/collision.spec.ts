import { makeController } from '../../Components/Controller'
import { makeEntityReference } from '../../Components/EntityReference'
import { makePhasing, playerARobotPhase, playerATowerPhase, victoryPhase } from '../../Components/Phasing'
import { position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { missingEntityId } from '../../Entities/infra/InMemoryEntityRepository'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, thereIsServerComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { attackEvent } from '../attack/attack'
import { joinSimpleMatchLobby } from '../join/join'
import { moveEvent } from '../move/move'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { notifyServerEvent } from '../notifyServer/notifyServer'
import { quitMatchEvent } from '../quit/quit'
import { collisionGameEvent } from './collision'

feature(featureEventDescription(Action.collision), () => {
    serverScenario(`${Action.collision} 1 - Collision with player activated pointer &  player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerAJoinSimpleMatchButton]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])).save()
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.playerAJoinSimpleMatchButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [joinSimpleMatchLobby(EntityIds.playerA, EntityIds.playerAMainMenu, EntityIds.simpleMatchLobby)]),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ])
        ])
    serverScenario(`${Action.collision} 2 - Collision with player idle pointer &  player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerAJoinSimpleMatchButton]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])).save()
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Idle).save()
            .buildEntity(EntityIds.playerAJoinSimpleMatchButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ])
        ])
    serverScenario(`${Action.collision} 3 - Collision with player pointer &  player end turn button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerANextTurnButton]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).save()
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [nextTurnEvent(EntityIds.match)])
        ])
    serverScenario(`${Action.collision} 4 - Collision with player pointer &  match cell`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityIds.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx1y1)])
        ])
    serverScenario(`${Action.collision} 5 - Collision with player pointer &  match cell & Tower`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBTower]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [attackEvent(EntityIds.playerA, EntityIds.playerARobot, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.collision} 6 - Collision with player pointer &  match cell & Robot`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBRobot]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityIds.playerBRobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [attackEvent(EntityIds.playerA, EntityIds.playerARobot, EntityIds.playerBRobot)])
        ])
    serverScenario(`${Action.collision} 7 - Collision with 2 player activated pointer &  2 player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerAJoinSimpleMatchButton, EntityIds.playerBPointer, EntityIds.playerBJoinSimpleMatchButton]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityIds.playerBJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerBPointer]], [EntityType.mainMenu, [EntityIds.playerBMainMenu]]])).save()
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.playerBPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.playerAJoinSimpleMatchButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])).save()
            .buildEntity(EntityIds.playerBJoinSimpleMatchButton).withEntityReferences(EntityType.button, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.button, [EntityIds.playerBJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerBPointer]], [EntityType.mainMenu, [EntityIds.playerBMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])),
                makeEntityReference(EntityIds.playerBJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [
                joinSimpleMatchLobby(EntityIds.playerA, EntityIds.playerAMainMenu, EntityIds.simpleMatchLobby),
                joinSimpleMatchLobby(EntityIds.playerB, EntityIds.playerBMainMenu, EntityIds.simpleMatchLobby)
            ]),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.button, [EntityIds.playerBJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerBPointer]], [EntityType.mainMenu, [EntityIds.playerBMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])),
                makeEntityReference(EntityIds.playerBJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ])
        ])
    serverScenario(`${Action.collision} 8 - Collision with player activated pointer and visible defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.defeat]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.defeat).withEntityReferences(EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])).withPhysical(position(0, 0), ShapeType.defeat, true).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [
                quitMatchEvent(EntityIds.match, EntityIds.playerA)
            ])
        ])
    serverScenario(`${Action.collision} 9 - Collision with player activated pointer and invisible defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.defeat]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.defeat).withEntityReferences(EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]]])).withPhysical(position(0, 0), ShapeType.defeat, false).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 10 - Collision with player activated pointer and visible victory`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerBPointer, EntityIds.victory]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerBPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.victory).withEntityReferences(EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])).withPhysical(position(0, 0), ShapeType.victory, true).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [
                quitMatchEvent(EntityIds.match, EntityIds.playerB)
            ])
        ])
    serverScenario(`${Action.collision} 11 - Collision with player activated pointer and invisible victory`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerBPointer, EntityIds.victory]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerBPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.victory).withEntityReferences(EntityType.victory, new Map([[EntityType.match, [EntityIds.match]]])).withPhysical(position(0, 0), ShapeType.victory, false).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 12 - Collision with player pointer &  match cell & Robot on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBRobot]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])).withPhase(victoryPhase(EntityIds.playerA)).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])).save()
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityIds.playerBRobot).withEntityReferences(EntityType.robot, new Map([])).save()
            .buildEntity(EntityIds.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 13 - Collision with player pointer &  match cell & Tower on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBTower]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])).withPhase(victoryPhase(EntityIds.playerA)).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])).save()
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower, new Map([])).save()
            .buildEntity(EntityIds.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 14 - Collision with player pointer &  player end turn button on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerANextTurnButton]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(victoryPhase(EntityIds.playerA)).save()
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 15 - Collision with player pointer &  match cell on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])).withPhase(victoryPhase(EntityIds.playerA)).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityIds.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    serverScenario(`${Action.collision} 16 - Collision with victory player activated pointer and visible victory & defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerBPointer, EntityIds.victory, EntityIds.defeat]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerBPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.defeat).withEntityReferences(EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])).withPhysical(position(0, 0), ShapeType.defeat, true).save()
            .buildEntity(EntityIds.victory).withEntityReferences(EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])).withPhysical(position(0, 0), ShapeType.victory, true).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [quitMatchEvent(EntityIds.match, EntityIds.playerB)])
        ])
    serverScenario(`${Action.collision} 16 - Collision with defeat player activated pointer and visible victory & defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.victory, EntityIds.defeat]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.defeat).withEntityReferences(EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])).withPhysical(position(0, 0), ShapeType.defeat, true).save()
            .buildEntity(EntityIds.victory).withEntityReferences(EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])).withPhysical(position(0, 0), ShapeType.victory, true).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [quitMatchEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.collision} 17 - Do nothing on collision with destroyed entities`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.cellx0y0, EntityIds.playerATower]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.cellx0y0).withEntityReferences(EntityType.cell).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [notifyServerEvent(missingEntityId(EntityIds.playerATower))])
        ])
    serverScenario(`${Action.collision} 18 - Collision with player pointer &  match cell & Tower & Other Match Tower`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBTower, EntityIds.playerCTower]]])),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withEntityReferences(EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])).withController(ControlStatus.Active).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
            .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerCTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerC]]])).save()
            .buildEntity(EntityIds.cellx1y1).withEntityReferences(EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerCTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerC]]])),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))

            ]),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [attackEvent(EntityIds.playerA, EntityIds.playerARobot, EntityIds.playerBTower)])
        ])
})
