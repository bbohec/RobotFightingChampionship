
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, feature, featureEventDescription, serverScenario, theEntityIsNotOnRepository, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { EntityReference } from '../../Components/EntityReference'
import { TestStep } from '../../Event/TestStep'
import { registerTowerEvent, registerRobotEvent, registerGridEvent, registerPlayerEvent, registerPlayerOnGameEvent, registerPlayerPointerEvent, registerSimpleMatchLobbyOnGame } from './register'
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
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, registerTowerEvent(EntityId.playerBTower, EntityId.playerA)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]]])))
        ])
    serverScenario(`${Action.register} 2`, registerRobotEvent(EntityId.playerARobot, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, registerRobotEvent(EntityId.playerARobot, EntityId.playerA)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.robot, [EntityId.playerARobot]]])))
        ])
    serverScenario(`${Action.register} 3`, [registerRobotEvent(EntityId.playerARobot, EntityId.playerA), registerTowerEvent(EntityId.playerBTower, EntityId.playerA)],
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, registerRobotEvent(EntityId.playerARobot, EntityId.playerA)),
            (game, adapters) => whenEventOccurs(game, registerTowerEvent(EntityId.playerBTower, EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, 'server', playerReadyForMatch(EntityId.match, EntityId.playerA))
        ])
    serverScenario(`${Action.register} 4`, registerGridEvent(EntityId.match, EntityId.grid),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => whenEventOccurs(game, registerGridEvent(EntityId.match, EntityId.grid)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.grid, [EntityId.grid]]])))
        ])
    clientScenario(`${Action.register} 5`, registerPlayerEvent(EntityId.playerA), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            (game, adapters) => whenEventOccurs(game, registerPlayerEvent(EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, 'server', registerPlayerEvent(EntityId.playerA))
        ])
    serverScenario(`${Action.register} 6`, registerPlayerEvent(EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.game).withEntityReferences(EntityType.game).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, registerPlayerEvent(EntityId.playerA)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, 'server', registerPlayerOnGameEvent(EntityId.playerA, EntityId.game))
        ])
    serverScenario(`${Action.register} 7`, registerPlayerOnGameEvent(EntityId.playerA, EntityId.game),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.game).withEntityReferences(EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
            (game, adapters) => whenEventOccurs(game, registerPlayerOnGameEvent(EntityId.playerA, EntityId.game)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.game, [EntityId.game]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]]))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createMainMenuEvent(EntityId.game, EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyButtonEvent(EntityId.simpleMatchLobby, EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerPointerEvent(EntityId.playerA))
        ])
    serverScenario(`${Action.register} 8 - Forward register pointer to client`, registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            (game, adapters) => whenEventOccurs(game, registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'client', registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA))
        ])
    clientScenario(`${Action.register} 9 - Register pointer to client`, registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerAPointer),
            (game, adapters) => whenEventOccurs(game, registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.pointer, [EntityId.playerAPointer]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'client', activatePointerEvent(EntityId.playerAPointer))
        ])
    serverScenario(`${Action.register} 10`, registerSimpleMatchLobbyOnGame(EntityId.game, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.game).withEntityReferences(EntityType.game).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map())),
            (game, adapters) => whenEventOccurs(game, registerSimpleMatchLobbyOnGame(EntityId.game, EntityId.simpleMatchLobby)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]]])))
        ])
})
