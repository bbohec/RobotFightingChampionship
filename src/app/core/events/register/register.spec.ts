import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario, clientScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents, thereIsClientComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent, whenEventOccurs } from '../../../test/unitTest/event'
import { makeEntityReference } from '../../components/EntityReference'
import { makeLifeCycle } from '../../components/LifeCycle'
import { makePhysical, position } from '../../components/Physical'
import { EntityBuilder } from '../../entity/entityBuilder'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { activatePointerEvent } from '../activate/activate'
import { createPlayerPointerEvent, createMainMenuEvent, createPlayerSimpleMatchLobbyButtonEvent } from '../create/create'
import { playerReadyForMatch } from '../ready/ready'
import { registerTowerEvent, registerRobotEvent, registerNextTurnButtonEvent, registerPlayerEvent, registerPlayerOnGameEvent, registerPlayerPointerEvent, registerSimpleMatchLobbyOnGame } from './register'

feature(Action.register, () => {
    serverScenario(`${Action.register} 1`, registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower, new Map()).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]]])),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]]))
            ]),
            eventsAreSent(TestStep.And, 'server', [])
        ])
    serverScenario(`${Action.register} 2`, registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map()).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.robot, [EntityIds.playerARobot]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]]))
            ]),
            eventsAreSent(TestStep.And, 'server', [])
        ])
    serverScenario(`${Action.register} 3`, registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityIds.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton, new Map()).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map()).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]]))
            ]),
            eventsAreSent(TestStep.And, 'server', [])
        ])
    serverScenario(`${Action.register} 4`, [
        registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA),
        registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA),
        registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton)
    ],
    [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
        .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
        .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot).save()
        .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower).save()
        .buildEntity(EntityIds.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton).save()
    , [
        whenEventOccurs(registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA)),
        whenEventOccurs(registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA)),
        whenEventOccurs(registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton)),
        eventsAreSent(TestStep.Then, 'server', [playerReadyForMatch(EntityIds.match, EntityIds.playerA)])
    ])
    serverScenario(`${Action.register} 5`, [
        registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA),
        registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA)
    ],
    [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
        .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.robot, []]])).save()
        .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot).save()
        .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower).save()
        .buildEntity(EntityIds.playerANextTurnButton).withEntityReferences(EntityType.nextTurnButton).save()
    , [
        whenEventOccurs(registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA)),
        whenEventOccurs(registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton)),
        eventsAreSent(TestStep.Then, 'server', [])
    ])
    clientScenario(`${Action.register} 6`, registerPlayerEvent(EntityIds.playerA), EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [registerPlayerEvent(EntityIds.playerA)])
        ])
    serverScenario(`${Action.register} 7`, registerPlayerEvent(EntityIds.playerA),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.game).withEntityReferences(EntityType.game).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map()),
                makeLifeCycle(EntityIds.playerA),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            eventsAreSent(TestStep.Then, 'server', [registerPlayerOnGameEvent(EntityIds.playerA, EntityIds.game)])
        ])
    serverScenario(`${Action.register} 8`, registerPlayerOnGameEvent(EntityIds.playerA, EntityIds.game),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.game).withEntityReferences(EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.game, [EntityIds.game]]]))
            ]),
            eventsAreSent(TestStep.And, 'server', [
                createPlayerPointerEvent(EntityIds.playerA),
                createMainMenuEvent(EntityIds.game, EntityIds.playerA),
                createPlayerSimpleMatchLobbyButtonEvent(EntityIds.simpleMatchLobby, EntityIds.playerA)
            ])
        ])
    serverScenario(`${Action.register} 9 - Forward register pointer to client`, registerPlayerPointerEvent(EntityIds.playerAPointer, EntityIds.playerA),
        [EntityIds.playerA], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            eventsAreSent(TestStep.And, EntityIds.playerA, [registerPlayerPointerEvent(EntityIds.playerAPointer, EntityIds.playerA)])
        ])
    clientScenario(`${Action.register} 10 - Register pointer to client`, registerPlayerPointerEvent(EntityIds.playerAPointer, EntityIds.playerA), EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
        , [
            thereIsClientComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.pointer, [EntityIds.playerAPointer]]])),
                makeLifeCycle(EntityIds.playerAPointer),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true)
            ]),
            eventsAreSent(TestStep.And, 'client', [activatePointerEvent(EntityIds.playerAPointer)])
        ])
    serverScenario(`${Action.register} 11`, registerSimpleMatchLobbyOnGame(EntityIds.game, EntityIds.simpleMatchLobby),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.game).withEntityReferences(EntityType.game).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ])
        ])
})
