
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, feature, featureEventDescription, serverScenario, theEntityIsNotOnRepository, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, eventsAreSent, whenEventOccured, whenEventOccurs } from '../../Event/test'
import { EntityReference } from '../../Components/EntityReference'
import { TestStep } from '../../Event/TestStep'
import { registerTowerEvent, registerRobotEvent, registerPlayerEvent, registerPlayerOnGameEvent, registerPlayerPointerEvent, registerSimpleMatchLobbyOnGame, registerNextTurnButtonEvent } from './register'
import { playerReadyForMatch } from '../ready/ready'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
import { createMainMenuEvent, createPlayerPointerEvent, createPlayerSimpleMatchLobbyButtonEvent } from '../create/create'
import { ShapeType } from '../../Components/port/ShapeType'
import { Physical, position } from '../../Components/Physical'
import { activatePointerEvent } from '../activate/activate'
feature(featureEventDescription(Action.register), () => {
    serverScenario(`${Action.register} 1`, registerTowerEvent(EntityId.playerBTower, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower, new Map()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, EntityReference, new EntityReference(EntityId.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ])
    serverScenario(`${Action.register} 2`, registerRobotEvent(EntityId.playerARobot, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.robot, [EntityId.playerARobot]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityId.playerA]]]))),
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
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, [EntityId.playerANextTurnButton]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, EntityReference, new EntityReference(EntityId.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.match, [EntityId.match]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.nextTurnButton, [EntityId.playerANextTurnButton]]]))),
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
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [registerPlayerOnGameEvent(EntityId.playerA, EntityId.game)])
        ])
    serverScenario(`${Action.register} 8`, registerPlayerOnGameEvent(EntityId.playerA, EntityId.game),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.game).withEntityReferences(EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.game, [EntityId.game]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
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
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.pointer, [EntityId.playerAPointer]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'client', [activatePointerEvent(EntityId.playerAPointer)])
        ])
    serverScenario(`${Action.register} 11`, registerSimpleMatchLobbyOnGame(EntityId.game, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.game).withEntityReferences(EntityType.game).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map())),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])))
        ])
})
