import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario, clientScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents, thereIsClientComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent, whenEventOccurs } from '../../../test/unitTest/event'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { makeLifeCycle } from '../../ecs/components/LifeCycle'
import { makePhysical, position } from '../../ecs/components/Physical'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { activatePointerEvent } from '../activate/activate'
import { createPlayerPointerEvent, createMainMenuEvent, createPlayerSimpleMatchLobbyButtonEvent } from '../create/create'
import { playerReadyForMatch } from '../ready/ready'
import { registerTowerEvent, registerRobotEvent, registerNextTurnButtonEvent, registerPlayerEvent, registerPlayerOnGameEvent, registerPlayerPointerEvent, registerSimpleMatchLobbyOnGame } from './register'

feature(Action.register, () => {
    serverScenario(`${Action.register} 1`, registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]]])),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]]))
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [])
        ])
    serverScenario(`${Action.register} 2`, registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.robot, [EntityIds.playerARobot]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]]))
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [])
        ])
    serverScenario(`${Action.register} 3`, registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match),
                makeEntityReference(EntityIds.playerA, EntityType.player),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]]))
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [])
        ])
    serverScenario(`${Action.register} 4`, [
        registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA),
        registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA),
        registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton)
    ],
    [], [
        thereIsServerComponents(TestStep.Given, [
            makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
            makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
            makeEntityReference(EntityIds.playerARobot, EntityType.robot),
            makeEntityReference(EntityIds.playerBTower, EntityType.tower),
            makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton)
        ]),
        whenEventOccurs(registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA)),
        whenEventOccurs(registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA)),
        whenEventOccurs(registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton)),
        thereIsServerComponents(TestStep.Then, [
            makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
            makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.tower, [EntityIds.playerBTower]]])),
            makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
            makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
            makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]]))
        ]),
        eventsAreSent(TestStep.Then, 'server', [playerReadyForMatch(EntityIds.match, EntityIds.playerA)])
    ])
    serverScenario(`${Action.register} 5`, [
        registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA),
        registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA)
    ],
    [], [
        thereIsServerComponents(TestStep.Given, [
            makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
            makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.robot, []]])),
            makeEntityReference(EntityIds.playerARobot, EntityType.robot),
            makeEntityReference(EntityIds.playerBTower, EntityType.tower),
            makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton)
        ]),
        whenEventOccurs(registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA)),
        whenEventOccurs(registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton)),
        thereIsServerComponents(TestStep.Then, [
            makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
            makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.robot, []], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
            makeEntityReference(EntityIds.playerARobot, EntityType.robot),
            makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
            makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]]))
        ]),
        eventsAreSent(TestStep.Then, 'server', [])
    ])
    clientScenario(`${Action.register} 6`, registerPlayerEvent(EntityIds.playerA), EntityIds.playerA
        , [
            thereIsClientComponents(TestStep.Given, [

            ]),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, [

            ]),
            eventsAreSent(TestStep.Then, 'server', [registerPlayerEvent(EntityIds.playerA)])
        ])
    serverScenario(`${Action.register} 7`, registerPlayerEvent(EntityIds.playerA),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map()),
                makeLifeCycle(EntityIds.playerA),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map()),
                makeLifeCycle(EntityIds.playerA),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            eventsAreSent(TestStep.Then, 'server', [registerPlayerOnGameEvent(EntityIds.playerA, EntityIds.game)])
        ])
    serverScenario(`${Action.register} 8`, registerPlayerOnGameEvent(EntityIds.playerA, EntityIds.game),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.game, [EntityIds.game]]]))
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [
                createPlayerPointerEvent(EntityIds.playerA),
                createMainMenuEvent(EntityIds.game, EntityIds.playerA),
                createPlayerSimpleMatchLobbyButtonEvent(EntityIds.simpleMatchLobby, EntityIds.playerA)
            ])
        ])
    serverScenario(`${Action.register} 9 - Forward register pointer to client`, registerPlayerPointerEvent(EntityIds.playerAPointer, EntityIds.playerA),
        [EntityIds.playerA], [
            thereIsServerComponents(TestStep.Given, [
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
            ]),
            eventsAreSent(TestStep.AndThen, EntityIds.playerA, [registerPlayerPointerEvent(EntityIds.playerAPointer, EntityIds.playerA)])
        ])
    clientScenario(`${Action.register} 10 - Register pointer to client`, registerPlayerPointerEvent(EntityIds.playerAPointer, EntityIds.playerA), EntityIds.playerA,
        [
            thereIsClientComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.pointer, [EntityIds.playerAPointer]]])),
                makeLifeCycle(EntityIds.playerAPointer),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true)
            ]),
            eventsAreSent(TestStep.AndThen, 'client', [activatePointerEvent(EntityIds.playerAPointer)])
        ])
    serverScenario(`${Action.register} 11`, registerSimpleMatchLobbyOnGame(EntityIds.game, EntityIds.simpleMatchLobby),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.game, EntityType.game, new Map([[EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ])
        ])
})
