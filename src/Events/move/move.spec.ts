import { describe } from 'mocha'
import { EntityReference } from '../../Components/EntityReference'
import { Phasing, playerATowerPhase, playerBRobotPhase } from '../../Components/Phasing'
import { Physical, playerATowerFirstPosition, position } from '../../Components/Physical'
import { Playable } from '../../Components/Playable'
import { MatchPlayer, PhaseType } from '../../Components/port/Phase'
import { Cell } from '../../Entities/Cell'
import { Match } from '../../Entities/Match'
import { Player } from '../../Entities/Player'
import { Robot } from '../../Entities/Robot'
import { Tower } from '../../Entities/Tower'
import { Action } from '../../Event/Action'
import { cellx1y2Id, cellx2y1Id, cellx2y2Id, matchId, playerAId, playerATowerId, playerBId, playerBRobotId, playerBTowerId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { notifyEvent, positionAlreadyOccupiedNotificationMessage } from '../notify/notify'
import { moveEvent } from './moveEvent'

/*
    - Case déjà occupé
    - Hors zone de jeu
    - Assez de point d'action
    - pas le bon tour
    - pas nos unités
*/

/* Refactor ideas

*/

describe(featureEventDescription(Action.move), () => {
    serverScenario(`${Action.move} 1 - Move Game Event - Horizontal`, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y1Id), [],
        (game, adapters) => () => {
            const towerA = new Tower(playerATowerId)
            towerA.addComponent(new Physical(playerATowerId, playerATowerFirstPosition))
            const playerA = new Player(playerAId)
            playerA.addComponent(new EntityReference(playerAId, new Map([
                [EntityType.tower, [playerATowerId]],
                [EntityType.match, [matchId]]
            ])))
            const cell = new Cell(cellx2y1Id)
            cell.addComponent(new Physical(cellx2y1Id, position(2, 1)))
            const match = new Match(matchId)
            match.addComponent(new Phasing(matchId, playerATowerPhase()))
            match.addComponent(new Playable(matchId, [playerAId]))
            adapters.entityInteractor.addEntities([match, towerA, cell, playerA])
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y1Id, Physical, new Physical(cellx2y1Id, position(2, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y1Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, { phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints: 11 }))
        ])
    serverScenario(`${Action.move} 2 - Move Game Event - Vertical`, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx1y2Id), [],
        (game, adapters) => () => {
            const towerA = new Tower(playerATowerId)
            towerA.addComponent(new Physical(playerATowerId, playerATowerFirstPosition))
            const playerA = new Player(playerAId)
            playerA.addComponent(new EntityReference(playerAId, new Map([
                [EntityType.tower, [playerATowerId]],
                [EntityType.match, [matchId]]
            ])))
            const cell = new Cell(cellx1y2Id)
            cell.addComponent(new Physical(cellx1y2Id, position(1, 2)))
            const match = new Match(matchId)
            match.addComponent(new Phasing(matchId, playerATowerPhase()))
            match.addComponent(new Playable(matchId, [playerAId]))
            adapters.entityInteractor.addEntities([match, towerA, cell, playerA])
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx1y2Id, Physical, new Physical(cellx1y2Id, position(1, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx1y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(1, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, { phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints: 11 }))
        ])

    serverScenario(`${Action.move} 3 - Move Game Event - Diagonal`, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y2Id), [],
        (game, adapters) => () => {
            const towerA = new Tower(playerATowerId)
            towerA.addComponent(new Physical(playerATowerId, playerATowerFirstPosition))
            const cell = new Cell(cellx2y2Id)
            cell.addComponent(new Physical(cellx2y2Id, position(2, 2)))
            const match = new Match(matchId)
            const playerA = new Player(playerAId)
            playerA.addComponent(new EntityReference(playerAId, new Map([
                [EntityType.tower, [playerATowerId]],
                [EntityType.match, [matchId]]
            ])))
            match.addComponent(new Phasing(matchId, playerATowerPhase()))
            match.addComponent(new Playable(matchId, [playerAId]))
            adapters.entityInteractor.addEntities([match, towerA, cell, playerA])
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y2Id, Physical, new Physical(cellx2y2Id, position(2, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, { phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints: 11 }))
        ])
    serverScenario(`${Action.move} 4 - Can't Move Game Event - Tower already on destination cell`, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y2Id), [],
        (game, adapters) => () => {
            const towerA = new Tower(playerATowerId)
            towerA.addComponent(new Physical(playerATowerId, playerATowerFirstPosition))
            const playerA = new Player(playerAId)
            playerA.addComponent(new EntityReference(playerAId, new Map([
                [EntityType.tower, [playerATowerId]],
                [EntityType.match, [matchId]]
            ])))
            const playerB = new Player(playerBId)
            playerB.addComponent(new EntityReference(playerBId, new Map([
                [EntityType.tower, [playerBTowerId]],
                [EntityType.match, [matchId]]
            ])))
            const towerB = new Tower(playerBTowerId)
            towerB.addComponent(new Physical(playerBTowerId, position(2, 2)))
            const cell = new Cell(cellx2y2Id)
            cell.addComponent(new Physical(cellx2y2Id, position(2, 2)))
            const match = new Match(matchId)
            match.addComponent(new Phasing(matchId, playerATowerPhase()))
            match.addComponent(new Playable(matchId, [playerAId, playerBId]))
            adapters.entityInteractor.addEntities([match, towerA, towerB, cell, playerA, playerB])
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y2Id, Physical, new Physical(cellx2y2Id, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(2, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerAId, EntityType.tower, playerATowerId, cellx2y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, { phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints: 12 })),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerAId, positionAlreadyOccupiedNotificationMessage))
        ])
    serverScenario(`${Action.move} 4 - Can't Move Game Event - Tower of same player already on destination cell`, moveEvent(playerBId, EntityType.robot, playerBRobotId, cellx2y2Id), [],
        (game, adapters) => () => {
            const robotB = new Robot(playerBRobotId)
            robotB.addComponent(new Physical(playerBRobotId, position(1, 1)))
            const playerB = new Player(playerBId)
            playerB.addComponent(new EntityReference(playerBId, new Map([
                [EntityType.tower, [playerBTowerId]],
                [EntityType.robot, [playerBRobotId]],
                [EntityType.match, [matchId]]
            ])))
            const towerB = new Tower(playerBTowerId)
            towerB.addComponent(new Physical(playerBTowerId, position(2, 2)))
            const cell = new Cell(cellx2y2Id)
            cell.addComponent(new Physical(cellx2y2Id, position(2, 2)))
            const match = new Match(matchId)
            match.addComponent(new Phasing(matchId, playerBRobotPhase()))
            match.addComponent(new Playable(matchId, [playerBId]))
            adapters.entityInteractor.addEntities([match, robotB, towerB, cell, playerB])
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerBRobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, Physical, new Physical(playerBRobotId, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y2Id, Physical, new Physical(cellx2y2Id, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(2, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerBId, EntityType.robot, playerBRobotId, cellx2y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBRobotId, Physical, new Physical(playerBRobotId, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, playerBRobotPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerBId, positionAlreadyOccupiedNotificationMessage))
        ])
    serverScenario(`${Action.move} 4 - Can't Move Game Event - Robot of same player already on destination cell`, moveEvent(playerBId, EntityType.robot, playerBTowerId, cellx2y2Id), [],
        (game, adapters) => () => {
            const robotB = new Robot(playerBRobotId)
            robotB.addComponent(new Physical(playerBRobotId, position(2, 2)))
            const playerB = new Player(playerBId)
            playerB.addComponent(new EntityReference(playerBId, new Map([
                [EntityType.tower, [playerBTowerId]],
                [EntityType.robot, [playerBRobotId]],
                [EntityType.match, [matchId]]
            ])))
            const towerB = new Tower(playerBTowerId)
            towerB.addComponent(new Physical(playerBTowerId, position(1, 1)))
            const cell = new Cell(cellx2y2Id)
            cell.addComponent(new Physical(cellx2y2Id, position(2, 2)))
            const match = new Match(matchId)
            match.addComponent(new Phasing(matchId, playerBRobotPhase()))
            match.addComponent(new Playable(matchId, [playerBId]))
            adapters.entityInteractor.addEntities([match, robotB, towerB, cell, playerB])
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerBRobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, Physical, new Physical(playerBRobotId, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, cellx2y2Id, Physical, new Physical(cellx2y2Id, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(1, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(playerBId, EntityType.robot, playerBTowerId, cellx2y2Id)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBTowerId, Physical, new Physical(playerBTowerId, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, playerBRobotPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(playerBId, positionAlreadyOccupiedNotificationMessage))
        ])
})
