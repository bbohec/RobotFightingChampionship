import { Test } from 'mocha'
import { Dimension } from '../../Components/Dimensional'
import { makePhasing, playerARobotAutoPlacementPhase, playerARobotPhase, playerATowerAutoPlacementPhase, playerATowerPhase, playerBRobotAutoPlacementPhase, playerBRobotPhase, playerBTowerAutoPlacementPhase, playerBTowerPhase, preparingGamePhase } from '../../Components/Phasing'
import { makePhysical, playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition, playerNextTurnButtonPosition, position, Position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { PhaseSequence } from '../../Systems/Phasing/PhasingSystem'
import { drawEvent } from '../draw/draw'
import { moveEvent } from '../move/move'
import { nextTurnEvent } from './nextTurn'

feature(featureEventDescription(Action.nextTurn), () => {
    interface Scenario {
        phaseSequence:PhaseSequence,
        additionnalTests:((game:ServerGameSystem, adapters: FakeServerAdapters, gameEvents:GameEvent|GameEvent[]) => Test)[]
    }
    const gridDimension:Dimension = { x: 10, y: 10 }
    const gridFirstCellPosition:Position = position(0, 0)
    const scenarios:Scenario[] = [
        {
            phaseSequence: {
                currentPhase: preparingGamePhase,
                nextPhase: playerATowerAutoPlacementPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx1y1)]),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBNextTurnButton, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerATowerAutoPlacementPhase(),
                nextPhase: playerARobotAutoPlacementPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx2y2)]),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBNextTurnButton, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerARobotAutoPlacementPhase(),
                nextPhase: playerBTowerAutoPlacementPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [moveEvent(EntityId.playerB, EntityType.tower, EntityId.playerBTower, EntityId.cellx10y10)]),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBNextTurnButton, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBTowerAutoPlacementPhase(),
                nextPhase: playerBRobotAutoPlacementPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerBRobot, EntityId.cellx9y9)]),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBNextTurnButton, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBRobotAutoPlacementPhase(),
                nextPhase: playerARobotPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityId.playerA, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                    drawEvent(EntityId.playerB, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
                ]),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBNextTurnButton, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerARobotPhase(),
                nextPhase: playerBRobotPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityId.playerA, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                    drawEvent(EntityId.playerB, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
                ]),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBNextTurnButton, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBRobotPhase(),
                nextPhase: playerATowerPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityId.playerA, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                    drawEvent(EntityId.playerB, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
                ]),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBNextTurnButton, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerATowerPhase(),
                nextPhase: playerBTowerPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityId.playerA, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                    drawEvent(EntityId.playerB, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
                ]),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBNextTurnButton, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBTowerPhase(),
                nextPhase: playerARobotPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityId.playerA, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                    drawEvent(EntityId.playerB, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
                ]),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, makePhysical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBNextTurnButton, makePhysical(EntityId.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        }
    ]
    scenarios.forEach((scenario, index) => {
        const tests: ((game:ServerGameSystem, adapters: FakeServerAdapters, gameEvents:GameEvent|GameEvent[]) => Test)[] = [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, makePhasing(EntityId.match, scenario.phaseSequence.currentPhase)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, makePhasing(EntityId.match, scenario.phaseSequence.nextPhase)),
            ...scenario.additionnalTests
        ]
        serverScenario(`${Action.nextTurn} ${index + 1}`, nextTurnEvent(EntityId.match),
            (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
                .buildEntity(EntityId.match).withPhase(scenario.phaseSequence.currentPhase).withEntityReferences(EntityType.match, new Map([[EntityType.grid, [EntityId.grid]], [EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
                .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityId.cellx0y0, EntityId.cellx1y1, EntityId.cellx2y2, EntityId.cellx9y9, EntityId.cellx10y10]]])).withDimension(gridDimension).save()
                .buildEntity(EntityId.cellx0y0).withPhysicalComponent(gridFirstCellPosition, ShapeType.cell, true).save()
                .buildEntity(EntityId.cellx1y1).withPhysicalComponent(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
                .buildEntity(EntityId.cellx2y2).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
                .buildEntity(EntityId.cellx9y9).withPhysicalComponent(playerBRobotFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true).save()
                .buildEntity(EntityId.cellx10y10).withPhysicalComponent(playerBTowerFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true).save()
                .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.nextTurnButton, [EntityId.playerANextTurnButton]]])).save()
                .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]], [EntityType.nextTurnButton, [EntityId.playerBNextTurnButton]]])).save()
                .buildEntity(EntityId.playerANextTurnButton).withPhysicalComponent(playerNextTurnButtonPosition, ShapeType.nextTurnButton, false).save()
                .buildEntity(EntityId.playerBNextTurnButton).withPhysicalComponent(playerNextTurnButtonPosition, ShapeType.nextTurnButton, false).save()
            , tests)
    })
})
