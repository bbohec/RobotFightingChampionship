
import { makeEntityReference } from '../../Components/EntityReference'
import { makePhysical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, eventsAreSent, feature, featureEventDescription, serverScenario, theEntityIsNotOnRepository, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, whenEventOccured, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { activatePointerEvent } from '../activate/activate'
import { createMainMenuEvent, createPlayerPointerEvent, createPlayerSimpleMatchLobbyButtonEvent } from '../create/create'
import { playerReadyForMatch } from '../ready/ready'
import { registerNextTurnButtonEvent, registerPlayerEvent, registerPlayerOnGameEvent, registerPlayerPointerEvent, registerRobotEvent, registerSimpleMatchLobbyOnGame, registerTowerEvent } from './register'
feature(featureEventDescription(Action.register), () => {
    serverScenario(`${Action.register} 1`, registerTowerEvent(EntityId.playerBTower, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower, new Map()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, makeEntityReference(EntityId.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ])
    serverScenario(`${Action.register} 2`, registerRobotEvent(EntityId.playerARobot, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.robot, [EntityId.playerARobot]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, makeEntityReference(EntityId.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ])
    serverScenario(`${Action.register} 3`, registerNextTurnButtonEvent(EntityId.playerA, EntityId.match, EntityId.playerANextTurnButton),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityId.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map()).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, [EntityId.playerANextTurnButton]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makeEntityReference(EntityId.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.match, [EntityId.match]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, makeEntityReference(EntityId.match, EntityType.match, new Map([[EntityType.nextTurnButton, [EntityId.playerANextTurnButton]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ])
    serverScenario(`${Action.register} 4`, [registerRobotEvent(EntityId.playerARobot, EntityId.playerA), registerTowerEvent(EntityId.playerBTower, EntityId.playerA)],
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower).save()
            .buildEntity(EntityId.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, adapters, registerRobotEvent(EntityId.playerARobot, EntityId.playerA)),
            (game, adapters) => whenEventOccurs(game, adapters, registerTowerEvent(EntityId.playerBTower, EntityId.playerA)),
            (game, adapters) => whenEventOccurs(game, adapters, registerNextTurnButtonEvent(EntityId.playerA, EntityId.match, EntityId.playerANextTurnButton)),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [playerReadyForMatch(EntityId.match, EntityId.playerA)])
        ])
    serverScenario(`${Action.register} 5`, [registerRobotEvent(EntityId.playerARobot, EntityId.playerA), registerTowerEvent(EntityId.playerBTower, EntityId.playerA)],
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.robot, []]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower).save()
            .buildEntity(EntityId.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, adapters, registerTowerEvent(EntityId.playerBTower, EntityId.playerA)),
            (game, adapters) => whenEventOccurs(game, adapters, registerNextTurnButtonEvent(EntityId.playerA, EntityId.match, EntityId.playerANextTurnButton)),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
    clientScenario(`${Action.register} 6`, registerPlayerEvent(EntityId.playerA), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [registerPlayerEvent(EntityId.playerA)])
        ])
    serverScenario(`${Action.register} 7`, registerPlayerEvent(EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.game).withEntityReferences(EntityType.game).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [registerPlayerOnGameEvent(EntityId.playerA, EntityId.game)])
        ])
    serverScenario(`${Action.register} 8`, registerPlayerOnGameEvent(EntityId.playerA, EntityId.game),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.game).withEntityReferences(EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.game, makeEntityReference(EntityId.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.game, [EntityId.game]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.game, makeEntityReference(EntityId.game, EntityType.game, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                createPlayerPointerEvent(EntityId.playerA),
                createMainMenuEvent(EntityId.game, EntityId.playerA),
                createPlayerSimpleMatchLobbyButtonEvent(EntityId.simpleMatchLobby, EntityId.playerA)
            ])
        ])
    serverScenario(`${Action.register} 9 - Forward register pointer to client`, registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'client', [registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA)])
        ])
    clientScenario(`${Action.register} 10 - Register pointer to client`, registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerAPointer),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerA, makeEntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.pointer, [EntityId.playerAPointer]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, makeEntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, makePhysical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'client', [activatePointerEvent(EntityId.playerAPointer)])
        ])
    serverScenario(`${Action.register} 11`, registerSimpleMatchLobbyOnGame(EntityId.game, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.game).withEntityReferences(EntityType.game).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.game, makeEntityReference(EntityId.game, EntityType.game, new Map())),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.game, makeEntityReference(EntityId.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])))
        ])
})
