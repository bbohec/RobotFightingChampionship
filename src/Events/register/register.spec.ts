
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { EntityReference } from '../../Components/EntityReference'
import { TestStep } from '../../Event/TestStep'
import { registerTowerEvent, registerRobotEvent, registerGridEvent } from './register'
import { playerReadyForMatch } from '../ready/ready'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
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
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, playerReadyForMatch(EntityId.match, EntityId.playerA))
        ])
    serverScenario(`${Action.register} 4`, registerGridEvent(EntityId.match, EntityId.grid),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => whenEventOccurs(game, registerGridEvent(EntityId.match, EntityId.grid)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.grid, [EntityId.grid]]])))
        ])
})
