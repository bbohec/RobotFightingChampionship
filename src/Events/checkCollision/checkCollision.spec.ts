import { makePhysical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, serverScenario, thereIsServerComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
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
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerARobot, EntityIds.playerBRobot]]]))])
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
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerARobot, EntityIds.playerBRobot]]]))])
        ])
})
