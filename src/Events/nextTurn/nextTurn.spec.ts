import { describe, Test, it } from 'mocha'
import { Action } from '../../Event/Action'
import { cellx10y10Id, cellx1y1Id, cellx2y2Id, cellx9y9Id, gridId, matchId, playerAId, playerBId, playerARobotId, playerBRobotId, playerATowerId, playerBTowerId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition } from '../../Components/Physical'
import { moveEvent } from '../move/move'
import { nextTurnEvent } from './nextTurn'
import { PhaseSequence } from '../../Systems/Phasing/PhasingSystem'
import { expect } from 'chai'
import { Phasing, playerARobotPhase, playerARobotPlacementPhase, playerATowerPhase, playerATowerPlacementPhase, playerBRobotPhase, playerBRobotPlacementPhase, playerBTowerPhase, playerBTowerPlacementPhase, preparingGamePhase } from '../../Components/Phasing'
import { EntityBuilder } from '../../Entities/entityBuilder'

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
        serverScenario(`${Action.nextTurn} ${index}`, nextTurnEvent(matchId),
            (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
                .buildEntity(matchId).withPhase(scenario.phaseSequence.currentPhase).withEntityReferences(new Map([[EntityType.grid, [gridId]]])).withPlayers([playerAId, playerBId]).save()
                .buildEntity(gridId).withEntityReferences(new Map([[EntityType.cell, [cellx1y1Id, cellx2y2Id, cellx9y9Id, cellx10y10Id]]])).save()
                .buildEntity(cellx1y1Id).withPosition(playerATowerFirstPosition).save()
                .buildEntity(cellx2y2Id).withPosition(playerARobotFirstPosition).save()
                .buildEntity(cellx9y9Id).withPosition(playerBRobotFirstPosition).save()
                .buildEntity(cellx10y10Id).withPosition(playerBTowerFirstPosition).save()
                .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.tower, [playerATowerId]], [EntityType.robot, [playerARobotId]]])).save()
                .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.tower, [playerBTowerId]], [EntityType.robot, [playerBRobotId]]])).save()
            , tests)
    })
    it.skip('Unit position on grid scale', () => {
        expect(true).to.be.false
    })
})
