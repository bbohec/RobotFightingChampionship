import { Test } from 'mocha'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition } from '../../Components/Physical'
import { moveEvent } from '../move/move'
import { nextTurnEvent } from './nextTurn'
import { PhaseSequence } from '../../Systems/Phasing/PhasingSystem'
import { Phasing, playerARobotPhase, playerARobotPlacementPhase, playerATowerPhase, playerATowerPlacementPhase, playerBRobotPhase, playerBRobotPlacementPhase, playerBTowerPhase, playerBTowerPlacementPhase, preparingGamePhase } from '../../Components/Phasing'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
import { ShapeType } from '../../Components/port/ShapeType'

feature(featureEventDescription(Action.nextTurn), () => {
    interface Scenario {
        phaseSequence:PhaseSequence,
        additionnalEventConsequence?:GameEvent[]
    }
    const scenarios:Scenario[] = [
        {
            phaseSequence: {
                currentPhase: preparingGamePhase,
                nextPhase: playerATowerPlacementPhase
            },
            additionnalEventConsequence: [
                moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx1y1),
                nextTurnEvent(EntityId.match)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerATowerPlacementPhase,
                nextPhase: playerARobotPlacementPhase
            },
            additionnalEventConsequence: [
                moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx2y2),
                nextTurnEvent(EntityId.match)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerARobotPlacementPhase,
                nextPhase: playerBTowerPlacementPhase
            },
            additionnalEventConsequence: [
                moveEvent(EntityId.playerB, EntityType.tower, EntityId.playerBTower, EntityId.cellx10y10),
                nextTurnEvent(EntityId.match)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBTowerPlacementPhase,
                nextPhase: playerBRobotPlacementPhase
            },
            additionnalEventConsequence: [
                moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerBRobot, EntityId.cellx9y9),
                nextTurnEvent(EntityId.match)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBRobotPlacementPhase,
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
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, scenario.phaseSequence.currentPhase)),
            (game, adapters) => whenEventOccurs(game, nextTurnEvent(EntityId.match)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, scenario.phaseSequence.nextPhase))
        ]
        if (scenario.additionnalEventConsequence) scenario.additionnalEventConsequence.forEach(event => tests.push((game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', event)))
        serverScenario(`${Action.nextTurn} ${index + 1}`, nextTurnEvent(EntityId.match),
            (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
                .buildEntity(EntityId.match).withPhase(scenario.phaseSequence.currentPhase).withEntityReferences(EntityType.match, new Map([[EntityType.grid, [EntityId.grid]]])).withPlayers([EntityId.playerA, EntityId.playerB]).save()
                .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityId.cellx1y1, EntityId.cellx2y2, EntityId.cellx9y9, EntityId.cellx10y10]]])).save()
                .buildEntity(EntityId.cellx1y1).withPhysicalComponent(playerATowerFirstPosition, ShapeType.cell).save()
                .buildEntity(EntityId.cellx2y2).withPhysicalComponent(playerARobotFirstPosition, ShapeType.cell).save()
                .buildEntity(EntityId.cellx9y9).withPhysicalComponent(playerBRobotFirstPosition, ShapeType.cell).save()
                .buildEntity(EntityId.cellx10y10).withPhysicalComponent(playerBTowerFirstPosition, ShapeType.cell).save()
                .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
                .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]]])).save()
            , tests)
    })
    serverScenario('Unit position on grid scale', nextTurnEvent(EntityId.match), undefined, [
        (game, adapters) => whenEventOccurs(game, nextTurnEvent(EntityId.match))
    ], undefined, true)
})
