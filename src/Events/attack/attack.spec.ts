import { Action } from '../../Event/Action'
import { eventsAreSent, thereIsServerComponents, featureEventDescription, serverScenario, feature, whenEventOccured, thereIsServerComponents } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { defaultActionPoints, makePhasing, playerARobotPhase, playerATowerPhase, playerBRobotPhase, playerBTowerPhase, weaponAttackActionPoints } from '../../Components/Phasing'
import { attackEvent } from './attack'
import { hitEvent } from '../hit/hit'
import { makePhysical, position } from '../../Components/Physical'
import { wrongUnitPhaseNotificationMessage, wrongPlayerPhaseNotificationMessage, notEnoughActionPointNotificationMessage, notifyPlayerEvent, outOfRangeNotificationMessage } from '../notifyPlayer/notifyPlayer'
import { EntityType } from '../../Event/EntityType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityIds } from '../../Event/entityIds'
import { ShapeType } from '../../Components/port/ShapeType'

/*
    - Friendly Fire?
    - Réduction de dommage sur la distance ?
*/

feature(featureEventDescription(Action.attack), () => {
    serverScenario(`${Action.attack} 1 - Attack Game Event - playerA Tower`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerARobot).withPhysicalComponent(position(2, 2), ShapeType.robot, true).save()
            .buildEntity(EntityIds.playerATower).withPhysicalComponent(position(2, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(3, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, { componentType: 'Phasing', entityId: EntityIds.match, currentPhase: playerATowerPhase(), readyPlayers: new Set() }),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.attack} 2 - Attack Game Event - playerB Tower`, attackEvent(EntityIds.playerB, EntityIds.playerBTower, EntityIds.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerBTowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysicalComponent(position(2, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(3, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBRobot).withPhysicalComponent(position(4, 2), ShapeType.robot, true).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerBTowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [hitEvent(EntityIds.playerBTower, EntityIds.playerATower)])
        ])
    serverScenario(`${Action.attack} 3 - Attack Game Event - playerA Robot`, attackEvent(EntityIds.playerA, EntityIds.playerARobot, EntityIds.playerBRobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerARobot).withPhysicalComponent(position(2, 2), ShapeType.robot, true).save()
            .buildEntity(EntityIds.playerBRobot).withPhysicalComponent(position(3, 2), ShapeType.robot, true).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerARobotPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerARobot, makePhysical(EntityIds.playerARobot, position(2, 2), ShapeType.robot, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBRobot, makePhysical(EntityIds.playerBRobot, position(3, 2), ShapeType.robot, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [hitEvent(EntityIds.playerARobot, EntityIds.playerBRobot)])
        ])
    serverScenario(`${Action.attack} 4 - Attack Game Event - playerB Robot`, attackEvent(EntityIds.playerB, EntityIds.playerBRobot, EntityIds.playerARobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerBRobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerARobot).withPhysicalComponent(position(2, 2), ShapeType.robot, true).save()
            .buildEntity(EntityIds.playerBRobot).withPhysicalComponent(position(3, 2), ShapeType.robot, true).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerBRobotPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerARobot, makePhysical(EntityIds.playerARobot, position(2, 2), ShapeType.robot, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBRobot, makePhysical(EntityIds.playerBRobot, position(3, 2), ShapeType.robot, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [hitEvent(EntityIds.playerBRobot, EntityIds.playerARobot)])
        ])
    serverScenario(`${Action.attack} 5 - Can't Attack : Bad Phase for tower player A`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysicalComponent(position(2, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(3, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerARobotPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, wrongUnitPhaseNotificationMessage(playerARobotPhase()))])
        ])
    serverScenario(`${Action.attack} 6 - Can't Attack: Bad Player`, attackEvent(EntityIds.playerB, EntityIds.playerBTower, EntityIds.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysicalComponent(position(2, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(3, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerB, wrongPlayerPhaseNotificationMessage(EntityIds.playerB))])
        ])
    serverScenario(`${Action.attack} 7 - Can't Attack : Out of Range - Horizontal 1`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysicalComponent(position(2, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(24, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(24, 2), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 8 - Can't Attack : Out of Range - Horizontal 2`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysicalComponent(position(24, 1), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(1, 1), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(24, 1), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(1, 1), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 8 - Can Attack : On Range - Horizontal 3 - Max Range`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysicalComponent(position(11, 1), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(1, 1), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(11, 1), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(1, 1), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.attack} 9 - Can't Attack : Out of Range - Vertical 1`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysicalComponent(position(1, 1), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysicalComponent(position(1, 24), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(1, 1), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(1, 24), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 10 - Can't Attack : Out of Range - Vertical 2`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildTower(EntityIds.playerATower, position(1, 3)).save()
            .buildTower(EntityIds.playerBTower, position(24, 3)).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(1, 3), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(24, 3), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 11 - Can Attack : On Range - Vertical 3 - Max Range`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildTower(EntityIds.playerATower, position(1, 1)).save()
            .buildTower(EntityIds.playerBTower, position(1, 11)).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(1, 1), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(1, 11), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.attack} 12 - Can't Attack : Out of Range - Diagonal`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildTower(EntityIds.playerATower, position(2, 2)).save()
            .buildTower(EntityIds.playerBTower, position(24, 24)).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(24, 24), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 13 - Can Attack : On Range - Diagonal - Max Range`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildTower(EntityIds.playerATower, position(2, 1)).save()
            .buildTower(EntityIds.playerBTower, position(11, 4)).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(2, 1), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(11, 4), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.attack} 14 - Can Attack : Reduce action point`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildTower(EntityIds.playerATower, position(2, 1)).save()
            .buildTower(EntityIds.playerBTower, position(11, 4)).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase())),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(2, 1), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(11, 4), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)]),
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase(defaultActionPoints - weaponAttackActionPoints)))
        ])
    serverScenario(`${Action.attack} 14 - Can't Attack : Not enough action point`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase(weaponAttackActionPoints - 1)).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildTower(EntityIds.playerATower, position(2, 1)).save()
            .buildTower(EntityIds.playerBTower, position(11, 4)).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase(weaponAttackActionPoints - 1))),
            thereIsServerComponents(TestStep.And, EntityIds.playerATower, makePhysical(EntityIds.playerATower, position(2, 1), ShapeType.tower, true)),
            thereIsServerComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(11, 4), ShapeType.tower, true)),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, playerATowerPhase(weaponAttackActionPoints - 1))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage)])
        ])
})
