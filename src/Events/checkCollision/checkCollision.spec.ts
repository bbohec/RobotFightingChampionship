import { Physical, position } from '../../Components/Physical'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsNotSent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { collisionGameEvent } from '../collision/collision'
import { checkCollisionGameEvent } from './checkCollision'
feature(featureEventDescription(Action.checkCollision), () => {
    serverScenario(`${Action.move} 1 - Check Collision Game Event - Collision with 2 entities and 1 entity without collision`, checkCollisionGameEvent(),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(position(0, 0)).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(0, 0)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(0, 1)).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(0, 0))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(0, 0))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(0, 1))),
            (game, adapters) => whenEventOccurs(game, checkCollisionGameEvent()),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerARobot, EntityId.playerBRobot]]]))),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerBTower]]])))
        ])
    serverScenario(`${Action.move} 2 - Check Collision Game Event - Collision with 2 entities on average position`, checkCollisionGameEvent(),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(position(0.25, 0.25)).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(0.26, 0.26)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(0, 1)).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(0.25, 0.25))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(0.26, 0.26))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(0, 1))),
            (game, adapters) => whenEventOccurs(game, checkCollisionGameEvent()),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerARobot, EntityId.playerBRobot]]]))),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, collisionGameEvent(new Map([[EntityType.unknown, [EntityId.playerBTower]]])))
        ])
})