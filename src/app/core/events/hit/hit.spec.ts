import { EntityIds } from '../../../../test/entityIds'
import { feature } from '../../../../test/feature'
import { serverScenario } from '../../../../test/scenario'
import { TestStep } from '../../../../test/TestStep'
import { thereIsServerComponents } from '../../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../../test/unitTest/event'
import { makeEntityReference } from '../../components/EntityReference'
import { makeHittable } from '../../components/Hittable'
import { makeOffensive } from '../../components/Offensive'
import { EntityBuilder } from '../../entity/entityBuilder'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { victoryEvent } from '../victory/victory'
import { hitEvent } from './hit'

feature(Action.hit, () => {
    serverScenario(`${Action.hit} 1 - Robot Hit Tower`, hitEvent(EntityIds.playerARobot, EntityIds.playerBTower),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerARobot).withDamagePoints(20).save()
            .buildEntity(EntityIds.playerBTower).withHitPoints(100).save()
        , [
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
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])).withDamagePoints(20).save()
            .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])).withHitPoints(100).save()
        , [
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
            eventsAreSent(TestStep.And, 'server', [victoryEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.hit} 3 - Robot Kill Robot`, hitEvent(EntityIds.playerARobot, EntityIds.playerBRobot),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])).withDamagePoints(20).save()
            .buildEntity(EntityIds.playerBRobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])).withHitPoints(50).save()
        , [
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
            eventsAreSent(TestStep.And, 'server', [victoryEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.hit} 4 - Tower Kill Robot`, hitEvent(EntityIds.playerATower, EntityIds.playerBRobot),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])).withDamagePoints(5).save()
            .buildEntity(EntityIds.playerBRobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])).withHitPoints(50).save()
        , [
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
            eventsAreSent(TestStep.And, 'server', [victoryEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.hit} 5 - Tower Kill Tower`, hitEvent(EntityIds.playerBTower, EntityIds.playerATower),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])).withHitPoints(100).save()
            .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])).withDamagePoints(5).save()
        , [
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
            eventsAreSent(TestStep.And, 'server', [victoryEvent(EntityIds.match, EntityIds.playerB)])
        ])
    serverScenario(`${Action.hit} 6 - Friendly Fire`, hitEvent(EntityIds.playerATower, EntityIds.playerBRobot), [], undefined, [
        ...whenEventOccured()
    ], undefined, true)
})
