import { EntityIds } from '../../../../test/entityIds'
import { feature } from '../../../../test/feature'
import { serverScenario } from '../../../../test/scenario'
import { TestStep } from '../../../../test/TestStep'
import { thereIsServerComponents } from '../../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../../test/unitTest/event'
import { position, makePhysical } from '../../components/Physical'
import { EntityBuilder } from '../../entity/entityBuilder'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { collisionGameEvent } from '../collision/collision'
import { checkCollisionGameEvent } from './checkCollision'

feature(Action.checkCollision, () => {
    serverScenario(`${Action.checkCollision} 1 - Check Collision Game Event - Collision with 2 entities and 1 entity without collision`, checkCollisionGameEvent(),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildRobot(EntityIds.playerARobot, position(0, 0)).save()
            .buildRobot(EntityIds.playerBRobot, position(0, 0)).save()
            .buildTower(EntityIds.playerBTower, position(0, 1)).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.playerBRobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, position(0, 1), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerARobot, EntityIds.playerBRobot]]]))])
        ])
    serverScenario(`${Action.checkCollision} 2 - Check Collision Game Event - Collision with 2 entities on average position`, checkCollisionGameEvent(),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildRobot(EntityIds.playerARobot, position(0.25, 0.25)).save()
            .buildRobot(EntityIds.playerBRobot, position(0.26, 0.26)).save()
            .buildTower(EntityIds.playerBTower, position(0, 1)).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.playerARobot, position(0.25, 0.25), ShapeType.robot, true),
                makePhysical(EntityIds.playerBRobot, position(0.26, 0.26), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, position(0, 1), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerARobot, EntityIds.playerBRobot]]]))])
        ])
})
