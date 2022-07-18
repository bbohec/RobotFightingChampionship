import { makePhysical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { collisionGameEvent } from '../collision/collision'
import { checkCollisionGameEvent } from './checkCollision'
feature(featureEventDescription(Action.checkCollision), () => {
    serverScenario(`${Action.move} 1 - Check Collision Game Event - Collision with 2 entities and 1 entity without collision`, checkCollisionGameEvent(),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildRobot(EntityId.playerARobot, position(0, 0)).save()
            .buildRobot(EntityId.playerBRobot, position(0, 0)).save()
            .buildTower(EntityId.playerBTower, position(0, 1)).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerARobot, makePhysical(EntityId.playerARobot, position(0, 0), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, makePhysical(EntityId.playerBRobot, position(0, 0), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, makePhysical(EntityId.playerBTower, position(0, 1), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerARobot, EntityId.playerBRobot]]]))])
        ])
    serverScenario(`${Action.move} 2 - Check Collision Game Event - Collision with 2 entities on average position`, checkCollisionGameEvent(),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildRobot(EntityId.playerARobot, position(0.25, 0.25)).save()
            .buildRobot(EntityId.playerBRobot, position(0.26, 0.26)).save()
            .buildTower(EntityId.playerBTower, position(0, 1)).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerARobot, makePhysical(EntityId.playerARobot, position(0.25, 0.25), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, makePhysical(EntityId.playerBRobot, position(0.26, 0.26), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, makePhysical(EntityId.playerBTower, position(0, 1), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerARobot, EntityId.playerBRobot]]]))])
        ])
})
