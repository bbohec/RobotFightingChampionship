import { describe, Test, it } from 'mocha'
import { EntityReference } from '../../Components/EntityReference'
import { Playable } from '../../Components/Playable'
import { Grid } from '../../Entities/Grid'
import { Match } from '../../Entities/Match'
import { Player } from '../../Entities/Player'
import { Action } from '../../Event/Action'
import { cellx10y10Id, cellx1y1Id, cellx2y2Id, cellx9y9Id, gridId, matchId, playerAId, playerBId, playerARobotId, playerBRobotId, playerATowerId, playerBTowerId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { Physical, playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition } from '../../Components/Physical'
import { moveEvent } from '../move/moveEvent'
import { nextTurnEvent } from './nextTurnEvent'
import { PhaseSequence } from '../../Systems/Phasing/PhasingSystem'
import { Cell } from '../../Entities/Cell'
import { expect } from 'chai'
import { Phasing, playerARobotPhase, playerARobotPlacementPhase, playerATowerPhase, playerATowerPlacementPhase, playerBRobotPhase, playerBRobotPlacementPhase, playerBTowerPhase, playerBTowerPlacementPhase, preparingGamePhase } from '../../Components/Phasing'

describe(featureEventDescription(Action.nextTurn), () => {
    interface Scenario {
        phaseSequence:PhaseSequence,
        additionnalEventConsequence?:GameEvent[]
    }
    const scenarios:Scenario[] = [
        {
            phaseSequence: {
                currentPhase: preparingGamePhase(),
                nextPhase: playerATowerPlacementPhase()
            },
            additionnalEventConsequence: [
                moveEvent(playerAId, EntityType.tower, playerATowerId, cellx1y1Id),
                nextTurnEvent(matchId)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerATowerPlacementPhase(),
                nextPhase: playerARobotPlacementPhase()
            },
            additionnalEventConsequence: [
                moveEvent(playerAId, EntityType.robot, playerARobotId, cellx2y2Id),
                nextTurnEvent(matchId)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerARobotPlacementPhase(),
                nextPhase: playerBTowerPlacementPhase()
            },
            additionnalEventConsequence: [
                moveEvent(playerBId, EntityType.tower, playerBTowerId, cellx10y10Id),
                nextTurnEvent(matchId)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBTowerPlacementPhase(),
                nextPhase: playerBRobotPlacementPhase()
            },
            additionnalEventConsequence: [
                moveEvent(playerBId, EntityType.robot, playerBRobotId, cellx9y9Id),
                nextTurnEvent(matchId)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBRobotPlacementPhase(),
                nextPhase: playerARobotPhase()
            }
        },
        {
            phaseSequence: {
                currentPhase: playerARobotPhase(),
                nextPhase: playerBRobotPhase()
            }
        },
        {
            phaseSequence: {
                currentPhase: playerBRobotPhase(),
                nextPhase: playerATowerPhase()
            }
        },
        {
            phaseSequence: {
                currentPhase: playerATowerPhase(),
                nextPhase: playerBTowerPhase()
            }
        },
        {
            phaseSequence: {
                currentPhase: playerBTowerPhase(),
                nextPhase: playerARobotPhase()
            }
        }
    ]
    scenarios.forEach((scenario, index) => {
        const tests: ((game:ServerGameSystem, adapters: FakeServerAdapters) => Test)[] = [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, scenario.phaseSequence.currentPhase)),
            (game, adapters) => whenEventOccurs(game, nextTurnEvent(matchId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Phasing, new Phasing(matchId, scenario.phaseSequence.nextPhase))
        ]
        if (scenario.additionnalEventConsequence) scenario.additionnalEventConsequence.forEach(event => tests.push((game, adapters) => theEventIsSent(TestStep.And, adapters, event)))
        serverScenario(`${Action.nextTurn} ${index}`, nextTurnEvent(matchId), undefined,
            (game, adapters) => () => {
                const match = new Match(matchId)
                match.addComponent(new Phasing(matchId, scenario.phaseSequence.currentPhase))
                match.addComponent(new Playable(matchId, [playerAId, playerBId]))
                match.addComponent(new EntityReference(matchId, new Map([[EntityType.grid, [gridId]]])))
                const grid = new Grid(gridId)
                grid.addComponent(new EntityReference(gridId, new Map([[EntityType.cell, [cellx1y1Id, cellx2y2Id, cellx9y9Id, cellx10y10Id]]])))
                const cellx1y1 = new Cell(cellx1y1Id)
                cellx1y1.addComponent(new Physical(cellx1y1Id, playerATowerFirstPosition))
                const cellx2y2 = new Cell(cellx2y2Id)
                cellx2y2.addComponent(new Physical(cellx2y2Id, playerARobotFirstPosition))
                const cellx9y9 = new Cell(cellx9y9Id)
                cellx9y9.addComponent(new Physical(cellx9y9Id, playerBRobotFirstPosition))
                const cellx10y10 = new Cell(cellx10y10Id)
                cellx10y10.addComponent(new Physical(cellx10y10Id, playerBTowerFirstPosition))
                const playerA = new Player(playerAId)
                playerA.addComponent(new EntityReference(playerAId, new Map([[EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])))
                const playerB = new Player(playerBId)
                playerB.addComponent(new EntityReference(playerBId, new Map([[EntityType.tower, [playerBTowerId]], [EntityType.robot, [playerBRobotId]]])))
                adapters.entityInteractor.addEntity(match)
                adapters.entityInteractor.addEntity(playerA)
                adapters.entityInteractor.addEntity(playerB)
                adapters.entityInteractor.addEntity(grid)
                adapters.entityInteractor.addEntity(cellx1y1)
                adapters.entityInteractor.addEntity(cellx2y2)
                adapters.entityInteractor.addEntity(cellx9y9)
                adapters.entityInteractor.addEntity(cellx10y10)
            }, tests)
    })
    it.skip('Unit position on grid scale', () => {
        expect(true).to.be.false
    })
})
