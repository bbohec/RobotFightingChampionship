import { describe } from 'mocha'
import { Action } from '../../Event/Action'
import { whenEventOccurs, theEventIsSent, theEntityWithIdHasTheExpectedComponent, featureEventDescription, theEventIsNotSent, serverScenario } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { matchId, playerBTowerId, playerATowerId, playerAId, playerBId, playerARobotId, playerBRobotId } from '../../Event/entityIds'
import { defaultActionPoints, Phasing, playerARobotPhase, playerATowerPhase, playerBRobotPhase, playerBTowerPhase, weaponAttackActionPoints } from '../../Components/Phasing'
import { attackEvent } from './attack'
import { hitEvent } from '../hit/hit'
import { Physical, position } from '../../Components/Physical'
import { wrongPhaseNotificationMessage, badPlayerNotificationMessage, notEnoughActionPointNotificationMessage, notifyEvent, outOfRangeNotificationMessage } from '../notify/notify'
import { EntityType } from '../../Event/EntityType'
import { EntityBuilder } from '../../Entities/entityBuilder'

/*
    - Friendly Fire?
    - Réduction de dommage sur la distance ?
*/

describe(featureEventDescription(Action.attack), () => {
    serverScenario(`${Action.attack} 1 - Attack Game Event - playerA Tower`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerARobotId).withPosition(position(2, 2)).save()
            .buildEntity(playerATowerId).withPosition(position(2, 2)).save()
            .buildEntity(playerBTowerId).withPosition(position(3, 2)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId))
        ])
    serverScenario(`${Action.create} 2 - Attack Game Event - playerB Tower`, attackEvent(playerBId, playerBTowerId, playerATowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerBTowerPhase()).withPlayers([playerAId, playerBId]).save()
            .buildEntity(playerATowerId).withPosition(position(2, 2)).save()
            .buildEntity(playerBTowerId).withPosition(position(3, 2)).save()
            .buildEntity(playerBRobotId).withPosition(position(4, 2)).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerBTowerId]], [EntityType.robot, [playerBRobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerBTowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerBId, playerBTowerId, playerATowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(playerBTowerId, playerATowerId))
        ])
    serverScenario(`${Action.create} 3 - Attack Game Event - playerA Robot`, attackEvent(playerAId, playerARobotId, playerBRobotId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerARobotPhase()).withPlayers([playerAId, playerBId]).save()
            .buildEntity(playerARobotId).withPosition(position(2, 2)).save()
            .buildEntity(playerBRobotId).withPosition(position(3, 2)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, Physical, new Physical(playerARobotId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, Physical, new Physical(playerBRobotId, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerARobotId, playerBRobotId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(playerARobotId, playerBRobotId))
        ])
    serverScenario(`${Action.create} 4 - Attack Game Event - playerB Robot`, attackEvent(playerBId, playerBRobotId, playerARobotId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerBRobotPhase()).withPlayers([playerAId, playerBId]).save()
            .buildEntity(playerARobotId).withPosition(position(2, 2)).save()
            .buildEntity(playerBRobotId).withPosition(position(3, 2)).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerBTowerId]], [EntityType.robot, [playerBRobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerBRobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, Physical, new Physical(playerARobotId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, Physical, new Physical(playerBRobotId, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerBId, playerBRobotId, playerARobotId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(playerBRobotId, playerARobotId))
        ])
    serverScenario(`${Action.create} 5 - Can't Attack : Bad Phase for tower player A`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerARobotPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(2, 2)).save()
            .buildEntity(playerBTowerId).withPosition(position(3, 2)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsNotSent(TestStep.Then, adapters, hitEvent(playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, wrongPhaseNotificationMessage(playerARobotPhase().phaseType)))
        ])
    serverScenario(`${Action.attack} 6 - Can't Attack: Bad Player`, attackEvent(playerBId, playerBTowerId, playerATowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(2, 2)).save()
            .buildEntity(playerBTowerId).withPosition(position(3, 2)).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerBTowerId]], [EntityType.robot, [playerBRobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(3, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerBId, playerBTowerId, playerATowerId)),
            (game, adapters) => theEventIsNotSent(TestStep.Then, adapters, hitEvent(playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerBId, badPlayerNotificationMessage(playerBId)))
        ])
    serverScenario(`${Action.create} 7 - Can't Attack : Out of Range - Horizontal 1`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(2, 2)).save()
            .buildEntity(playerBTowerId).withPosition(position(24, 2)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(24, 2))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.create} 8 - Can't Attack : Out of Range - Horizontal 2`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(24, 1)).save()
            .buildEntity(playerBTowerId).withPosition(position(1, 1)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(24, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(1, 1))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.create} 8 - Can Attack : On Range - Horizontal 3 - Max Range`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(11, 1)).save()
            .buildEntity(playerBTowerId).withPosition(position(1, 1)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(11, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(1, 1))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId))
        ])
    serverScenario(`${Action.create} 9 - Can't Attack : Out of Range - Vertical 1`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(1, 1)).save()
            .buildEntity(playerBTowerId).withPosition(position(1, 24)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(1, 24))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.create} 10 - Can't Attack : Out of Range - Vertical 2`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(1, 3)).save()
            .buildEntity(playerBTowerId).withPosition(position(24, 3)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(1, 3))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(24, 3))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.create} 11 - Can Attack : On Range - Vertical 3 - Max Range`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(1, 1)).save()
            .buildEntity(playerBTowerId).withPosition(position(1, 11)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(1, 11))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId))
        ])
    serverScenario(`${Action.create} 12 - Can't Attack : Out of Range - Diagonal`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(2, 2)).save()
            .buildEntity(playerBTowerId).withPosition(position(24, 24)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(24, 24))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, outOfRangeNotificationMessage))
        ])
    serverScenario(`${Action.create} 13 - Can Attack : On Range - Diagonal - Max Range`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(2, 1)).save()
            .buildEntity(playerBTowerId).withPosition(position(11, 4)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(11, 4))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId))
        ])
    serverScenario(`${Action.create} 14 - Can Attack : Reduce action point`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(2, 1)).save()
            .buildEntity(playerBTowerId).withPosition(position(11, 4)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(11, 4))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase(defaultActionPoints - weaponAttackActionPoints)))
        ])
    serverScenario(`${Action.create} 14 - Can't Attack : Not enough action point`, attackEvent(playerAId, playerATowerId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase(weaponAttackActionPoints - 1)).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(position(2, 1)).save()
            .buildEntity(playerBTowerId).withPosition(position(11, 4)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]], [EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase(weaponAttackActionPoints - 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(11, 4))),
            (game, adapters) => whenEventOccurs(game, attackEvent(playerAId, playerATowerId, playerBTowerId)),
            (game, adapters) => theEventIsNotSent(TestStep.And, adapters, hitEvent(playerATowerId, playerBTowerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase(weaponAttackActionPoints - 1))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, notEnoughActionPointNotificationMessage))
        ])
})
