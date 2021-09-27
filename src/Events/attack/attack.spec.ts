import { Action } from '../../Event/Action'
import { whenEventOccurs, theEventIsSent, theEntityWithIdHasTheExpectedComponent, featureEventDescription, theEventIsNotSent, serverScenario, feature } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { defaultActionPoints, Phasing, playerARobotPhase, playerATowerPhase, playerBRobotPhase, playerBTowerPhase, weaponAttackActionPoints } from '../../Components/Phasing'
import { attackEvent } from './attack'
import { hitEvent } from '../hit/hit'
import { Physical, position } from '../../Components/Physical'
import { wrongUnitPhaseNotificationMessage, badPlayerNotificationMessage, notEnoughActionPointNotificationMessage, notifyEvent, outOfRangeNotificationMessage } from '../notify/notify'
import { EntityType } from '../../Event/EntityType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'

/*
    - Friendly Fire?
    - Réduction de dommage sur la distance ?
*/

feature(featureEventDescription(Action.attack), () => {
    serverScenario(`${Action.attack} 1 - Attack Game Event - playerA Tower`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(3, 2)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower))
        ])
    serverScenario(`${Action.attack} 2 - Attack Game Event - playerB Tower`, attackEvent(EntityId.playerB, EntityId.playerBTower, EntityId.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerBTowerPhase()).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(3, 2)).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(4, 2)).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBTowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerB, EntityId.playerBTower, EntityId.playerATower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(EntityId.playerBTower, EntityId.playerATower))
        ])
    serverScenario(`${Action.attack} 3 - Attack Game Event - playerA Robot`, attackEvent(EntityId.playerA, EntityId.playerARobot, EntityId.playerBRobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotPhase()).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(3, 2)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerARobot, EntityId.playerBRobot)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(EntityId.playerARobot, EntityId.playerBRobot))
        ])
    serverScenario(`${Action.attack} 4 - Attack Game Event - playerB Robot`, attackEvent(EntityId.playerB, EntityId.playerBRobot, EntityId.playerARobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerBRobotPhase()).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(3, 2)).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBRobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerB, EntityId.playerBRobot, EntityId.playerARobot)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(EntityId.playerBRobot, EntityId.playerARobot))
        ])
    serverScenario(`${Action.attack} 5 - Can't Attack : Bad Phase for tower player A`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(3, 2)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsNotSent(TestStep.Then, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, wrongUnitPhaseNotificationMessage(playerARobotPhase())))
        ])
    serverScenario(`${Action.attack} 6 - Can't Attack: Bad Player`, attackEvent(EntityId.playerB, EntityId.playerBTower, EntityId.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(3, 2)).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerB, EntityId.playerBTower, EntityId.playerATower)),
            (game, adapters) => theEventIsNotSent(TestStep.Then, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerB, badPlayerNotificationMessage(EntityId.playerB)))
        ])
    serverScenario(`${Action.attack} 7 - Can't Attack : Out of Range - Horizontal 1`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(24, 2)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(24, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.attack} 8 - Can't Attack : Out of Range - Horizontal 2`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(24, 1)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(1, 1)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(24, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(1, 1))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.attack} 8 - Can Attack : On Range - Horizontal 3 - Max Range`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(11, 1)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(1, 1)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(11, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(1, 1))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower))
        ])
    serverScenario(`${Action.attack} 9 - Can't Attack : Out of Range - Vertical 1`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(1, 1)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(1, 24)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(1, 24))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.attack} 10 - Can't Attack : Out of Range - Vertical 2`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(1, 3)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(24, 3)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(1, 3))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(24, 3))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.attack} 11 - Can Attack : On Range - Vertical 3 - Max Range`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(1, 1)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(1, 11)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(1, 11))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower))
        ])
    serverScenario(`${Action.attack} 12 - Can't Attack : Out of Range - Diagonal`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(24, 24)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(24, 24))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.attack} 13 - Can Attack : On Range - Diagonal - Max Range`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(2, 1)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(11, 4)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(11, 4))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower))
        ])
    serverScenario(`${Action.attack} 14 - Can Attack : Reduce action point`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(2, 1)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(11, 4)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(11, 4))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase(defaultActionPoints - weaponAttackActionPoints)))
        ])
    serverScenario(`${Action.attack} 14 - Can't Attack : Not enough action point`, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase(weaponAttackActionPoints - 1)).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(2, 1)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(11, 4)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]], [EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase(weaponAttackActionPoints - 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(11, 4))),
            (game, adapters) => whenEventOccurs(game, attackEvent(EntityId.playerA, EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(EntityId.playerATower, EntityId.playerBTower)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase(weaponAttackActionPoints - 1))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, notEnoughActionPointNotificationMessage))
        ])
})