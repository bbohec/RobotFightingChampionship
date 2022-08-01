import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { makeHittable } from '../../ecs/components/Hittable'
import { makeOffensive } from '../../ecs/components/Offensive'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { victoryEvent } from '../victory/victory'
import { hitEvent } from './hit'

feature(Action.hit, () => {
    serverScenario(`${Action.hit} 1 - Robot Hit Tower`, hitEvent(EntityIds.playerARobot, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeOffensive(EntityIds.playerARobot, 20),
                makeHittable(EntityIds.playerBTower, 100)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeOffensive(EntityIds.playerARobot, 20),
                makeHittable(EntityIds.playerBTower, 80)
            ])
        ])

    serverScenario(`${Action.hit} 2 - Robot Kill Tower`, hitEvent(EntityIds.playerARobot, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeOffensive(EntityIds.playerARobot, 20),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeHittable(EntityIds.playerBTower, 100)
            ]),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeOffensive(EntityIds.playerARobot, 20),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeHittable(EntityIds.playerBTower, 0)
            ]),
            eventsAreSent(TestStep.Then, 'server', [victoryEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.hit} 3 - Robot Kill Robot`, hitEvent(EntityIds.playerARobot, EntityIds.playerBRobot),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeOffensive(EntityIds.playerARobot, 20),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeHittable(EntityIds.playerBRobot, 50)
            ]),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeOffensive(EntityIds.playerARobot, 20),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeHittable(EntityIds.playerBRobot, -10)
            ]),
            eventsAreSent(TestStep.Then, 'server', [victoryEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.hit} 4 - Tower Kill Robot`, hitEvent(EntityIds.playerATower, EntityIds.playerBRobot),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeOffensive(EntityIds.playerATower, 5),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeHittable(EntityIds.playerBRobot, 50)
            ]),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeOffensive(EntityIds.playerATower, 5),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeHittable(EntityIds.playerBRobot, 0)
            ]),
            eventsAreSent(TestStep.Then, 'server', [victoryEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.hit} 5 - Tower Kill Tower`, hitEvent(EntityIds.playerBTower, EntityIds.playerATower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeHittable(EntityIds.playerATower, 100),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeOffensive(EntityIds.playerBTower, 5)
            ]),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeHittable(EntityIds.playerATower, 0),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeOffensive(EntityIds.playerBTower, 5)
            ]),
            eventsAreSent(TestStep.Then, 'server', [victoryEvent(EntityIds.match, EntityIds.playerB)])
        ])
    serverScenario(`${Action.hit} 6 - Friendly Fire`, hitEvent(EntityIds.playerATower, EntityIds.playerBRobot), [], [
        ...whenEventOccured()
    ], undefined, true)
})
