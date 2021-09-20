import { describe } from 'mocha'
import { Phasing, playerATowerPhase, playerBRobotPhase } from '../../Components/Phasing'
import { Physical, playerATowerFirstPosition, playerBTowerFirstPosition, position } from '../../Components/Physical'
import { MatchPlayer, PhaseType } from '../../Components/port/Phase'
import { Action } from '../../Event/Action'
import { cellx1y2Id, cellx2y1Id, cellx2y2Id, matchId, playerAId, playerATowerId, playerBId, playerBRobotId, playerBTowerId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { badPlayerNotificationMessage, notEnoughActionPointNotificationMessage, notifyEvent, positionAlreadyOccupiedNotificationMessage } from '../notify/notify'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { moveEvent } from './move'

/*
    - pas la bonne unité
*/

/* Refactor ideas

*/

describe(featureEventDescription(Action.move), () => {
    serverScenario(`${Action.move} 1 - Move Game Event - Horizontal`, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y1Id),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.tower, [playerATowerId]], [EntityType.match, [matchId]]])).save()
            .buildEntity(playerATowerId).withPosition(playerATowerFirstPosition).save()
            .buildEntity(cellx2y1Id).withPosition(position(2, 1)).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y1Id, Physical, new Physical(cellx2y1Id, position(2, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y1Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, { phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints: 11 }))
        ])
    serverScenario(`${Action.move} 2 - Move Game Event - Vertical`, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx1y2Id),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(cellx1y2Id).withPosition(position(1, 2)).save()
            .buildEntity(playerATowerId).withPosition(playerATowerFirstPosition).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.tower, [playerATowerId]], [EntityType.match, [matchId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx1y2Id, Physical, new Physical(cellx1y2Id, position(1, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx1y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(1, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, { phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints: 11 }))
        ])
    serverScenario(`${Action.move} 3 - Move Game Event - Diagonal`, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y2Id),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId]).save()
            .buildEntity(cellx2y2Id).withPosition(position(2, 2)).save()
            .buildEntity(playerATowerId).withPosition(playerATowerFirstPosition).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.tower, [playerATowerId]], [EntityType.match, [matchId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y2Id, Physical, new Physical(cellx2y2Id, position(2, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, { phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints: 11 }))
        ])
    serverScenario(`${Action.move} 4 - Can't Move Game Event - Tower already on destination cell`, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y2Id),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId, playerBId]).save()
            .buildEntity(cellx2y2Id).withPosition(position(2, 2)).save()
            .buildEntity(playerATowerId).withPosition(playerATowerFirstPosition).save()
            .buildEntity(playerBTowerId).withPosition(position(2, 2)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.tower, [playerATowerId]], [EntityType.match, [matchId]]])).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.tower, [playerBTowerId]], [EntityType.match, [matchId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y2Id, Physical, new Physical(cellx2y2Id, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(2, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, { phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints: 12 })),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, positionAlreadyOccupiedNotificationMessage))
        ])
    serverScenario(`${Action.move} 4 - Can't Move Game Event - Tower of same player already on destination cell`, moveEvent(playerBId, EntityType.robot, playerBRobotId, cellx2y2Id),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerBRobotPhase()).withPlayers([playerAId, playerBId]).save()
            .buildEntity(cellx2y2Id).withPosition(position(2, 2)).save()
            .buildEntity(playerBRobotId).withPosition(position(1, 1)).save()
            .buildEntity(playerBTowerId).withPosition(position(2, 2)).save()
            .buildEntity(playerATowerId).withPosition(playerATowerFirstPosition).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.tower, [playerATowerId]], [EntityType.match, [matchId]]])).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.tower, [playerBTowerId]], [EntityType.robot, [playerBRobotId]], [EntityType.match, [matchId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerBRobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, Physical, new Physical(playerBRobotId, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y2Id, Physical, new Physical(cellx2y2Id, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(2, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerBId, EntityType.robot, playerBRobotId, cellx2y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBRobotId, Physical, new Physical(playerBRobotId, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, playerBRobotPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerBId, positionAlreadyOccupiedNotificationMessage))
        ])
    serverScenario(`${Action.move} 5 - Can't Move Game Event - Robot of same player already on destination cell`, moveEvent(playerBId, EntityType.robot, playerBTowerId, cellx2y2Id),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerBRobotPhase()).withPlayers([playerAId, playerBId]).save()
            .buildEntity(playerBRobotId).withPosition(position(2, 2)).save()
            .buildEntity(playerBTowerId).withPosition(position(1, 1)).save()
            .buildEntity(playerATowerId).withPosition(playerATowerFirstPosition).save()
            .buildEntity(cellx2y2Id).withPosition(position(2, 2)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.tower, [playerATowerId]], [EntityType.match, [matchId]]])).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.tower, [playerBTowerId]], [EntityType.robot, [playerBRobotId]], [EntityType.match, [matchId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerBRobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, Physical, new Physical(playerBRobotId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y2Id, Physical, new Physical(cellx2y2Id, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(1, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerBId, EntityType.tower, playerBTowerId, cellx2y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, playerBRobotPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerBId, positionAlreadyOccupiedNotificationMessage))
        ])
    serverScenario(`${Action.move} 6 - Can't Move Game Event - No action points`, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y1Id),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase(0)).withPlayers([playerAId]).save()
            .buildEntity(playerATowerId).withPosition(playerATowerFirstPosition).save()
            .buildEntity(cellx2y1Id).withPosition(position(2, 1)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.tower, [playerATowerId]], [EntityType.match, [matchId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase(0))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y1Id, Physical, new Physical(cellx2y1Id, position(2, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y1Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase(0))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, notEnoughActionPointNotificationMessage))
        ])
    serverScenario(`${Action.move} 7 - Can't Move Game Event - Bad Player`, moveEvent(playerBId, EntityType.tower, playerATowerId, cellx2y1Id),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(playerATowerPhase()).withPlayers([playerAId, playerBId]).save()
            .buildEntity(playerATowerId).withPosition(playerATowerFirstPosition).save()
            .buildEntity(playerBTowerId).withPosition(playerBTowerFirstPosition).save()
            .buildEntity(cellx2y1Id).withPosition(position(2, 1)).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.tower, [playerATowerId]], [EntityType.match, [matchId]]])).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.tower, [playerBTowerId]], [EntityType.match, [matchId]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y1Id, Physical, new Physical(cellx2y1Id, position(2, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerBId, EntityType.tower, playerATowerId, cellx2y1Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerBId, badPlayerNotificationMessage(playerBId)))
        ])
    serverScenario(`${Action.move} 7 - Can't Move Game Event - Bad Unit`, moveEvent(playerBId, EntityType.tower, playerATowerId, cellx2y1Id),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)

        , [

            (game, adapters) => whenEventOccurs(game, moveEvent(playerBId, EntityType.tower, playerATowerId, cellx2y1Id))

        ],
        undefined, true)
})
