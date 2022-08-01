import { entityHasBeenDamaged, entityHasBeenDetroyed } from '../../../messages'
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
import { notifyPlayerEvent } from '../notifyPlayer/notifyPlayer'
import { victoryEvent } from '../victory/victory'
import { hitEvent } from './hit'

feature(Action.hit, () => {
    serverScenario(`${Action.hit} 1 - Robot Hit Tower`, hitEvent(EntityIds.playerARobot, EntityIds.playerBTower),
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
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeOffensive(EntityIds.playerARobot, 20),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeHittable(EntityIds.playerBTower, 80)
            ]),
            eventsAreSent(TestStep.Then, 'server', [
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 80)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 80))
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
            eventsAreSent(TestStep.Then, 'server', [
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 80)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 80)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 60)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 60)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 40)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 40)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 20)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 20)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 0)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBTower, 20, 0)),
                victoryEvent(EntityIds.match, EntityIds.playerA),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDetroyed(EntityIds.playerARobot, EntityIds.playerBTower)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDetroyed(EntityIds.playerARobot, EntityIds.playerBTower))
            ])
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
            eventsAreSent(TestStep.Then, 'server', [
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBRobot, 20, 30)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBRobot, 20, 30)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBRobot, 20, 10)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBRobot, 20, 10)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBRobot, 20, -10)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerARobot, EntityIds.playerBRobot, 20, -10)),
                victoryEvent(EntityIds.match, EntityIds.playerA),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDetroyed(EntityIds.playerARobot, EntityIds.playerBRobot)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDetroyed(EntityIds.playerARobot, EntityIds.playerBRobot))
            ])
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
            eventsAreSent(TestStep.Then, 'server', [
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 45)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 45)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 40)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 40)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 35)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 35)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 30)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 30)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 25)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 25)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 20)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 20)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 15)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 15)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 10)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 10)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 5)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 5)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 0)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerATower, EntityIds.playerBRobot, 5, 0)),
                victoryEvent(EntityIds.match, EntityIds.playerA),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDetroyed(EntityIds.playerATower, EntityIds.playerBRobot)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDetroyed(EntityIds.playerATower, EntityIds.playerBRobot))
            ])
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

            eventsAreSent(TestStep.Then, 'server', [
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 95)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 95)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 90)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 90)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 85)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 85)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 80)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 80)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 75)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 75)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 70)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 70)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 65)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 65)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 60)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 60)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 55)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 55)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 50)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 50)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 45)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 45)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 40)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 40)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 35)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 35)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 30)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 30)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 25)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 25)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 20)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 20)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 15)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 15)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 10)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 10)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 5)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 5)),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 0)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDamaged(EntityIds.playerBTower, EntityIds.playerATower, 5, 0)),
                victoryEvent(EntityIds.match, EntityIds.playerB),
                notifyPlayerEvent(EntityIds.playerA, entityHasBeenDetroyed(EntityIds.playerBTower, EntityIds.playerATower)),
                notifyPlayerEvent(EntityIds.playerB, entityHasBeenDetroyed(EntityIds.playerBTower, EntityIds.playerATower))
            ])
        ])
    serverScenario(`${Action.hit} 6 - Friendly Fire`, hitEvent(EntityIds.playerATower, EntityIds.playerBRobot), [], [
        ...whenEventOccured()
    ], undefined, true)
})
