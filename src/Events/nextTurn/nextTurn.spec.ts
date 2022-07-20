import { Test } from 'mocha'
import { Dimension } from '../../Components/Dimensional'
import { makePhasing, playerARobotAutoPlacementPhase, playerARobotPhase, playerATowerAutoPlacementPhase, playerATowerPhase, playerBRobotAutoPlacementPhase, playerBRobotPhase, playerBTowerAutoPlacementPhase, playerBTowerPhase, preparingGamePhase } from '../../Components/Phasing'
import { makePhysical, playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition, playerNextTurnButtonPosition, position, Position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { eventsAreSent, feature, featureEventDescription, serverScenario, thereIsClientComponents, whenEventOccured } from '../../Event/test'
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
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [moveEvent(EntityIds.playerA, EntityType.tower, EntityIds.playerATower, EntityIds.cellx1y1)]),
                thereIsClientComponents(TestStep.And,  EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                thereIsClientComponents(TestStep.And,  EntityIds.playerBNextTurnButton, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerATowerAutoPlacementPhase(),
                nextPhase: playerARobotAutoPlacementPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y2)]),
                thereIsClientComponents(TestStep.And,  EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                thereIsClientComponents(TestStep.And,  EntityIds.playerBNextTurnButton, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerARobotAutoPlacementPhase(),
                nextPhase: playerBTowerAutoPlacementPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [moveEvent(EntityIds.playerB, EntityType.tower, EntityIds.playerBTower, EntityIds.cellx10y10)]),
                thereIsClientComponents(TestStep.And,  EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                thereIsClientComponents(TestStep.And,  EntityIds.playerBNextTurnButton, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBTowerAutoPlacementPhase(),
                nextPhase: playerBRobotAutoPlacementPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerBRobot, EntityIds.cellx9y9)]),
                thereIsClientComponents(TestStep.And,  EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                thereIsClientComponents(TestStep.And,  EntityIds.playerBNextTurnButton, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBRobotAutoPlacementPhase(),
                nextPhase: playerARobotPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                    drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
                ]),
                thereIsClientComponents(TestStep.And,  EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                thereIsClientComponents(TestStep.And,  EntityIds.playerBNextTurnButton, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerARobotPhase(),
                nextPhase: playerBRobotPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                    drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
                ]),
                thereIsClientComponents(TestStep.And,  EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                thereIsClientComponents(TestStep.And,  EntityIds.playerBNextTurnButton, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBRobotPhase(),
                nextPhase: playerATowerPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                    drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
                ]),
                thereIsClientComponents(TestStep.And,  EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                thereIsClientComponents(TestStep.And,  EntityIds.playerBNextTurnButton, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerATowerPhase(),
                nextPhase: playerBTowerPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                    drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
                ]),
                thereIsClientComponents(TestStep.And,  EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                thereIsClientComponents(TestStep.And,  EntityIds.playerBNextTurnButton, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBTowerPhase(),
                nextPhase: playerARobotPhase()
            },
            additionnalTests: [
                (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                    drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                    drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
                ]),
                thereIsClientComponents(TestStep.And,  EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                thereIsClientComponents(TestStep.And,  EntityIds.playerBNextTurnButton, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ]
        }
    ]
    scenarios.forEach((scenario, index) => {
        const tests: ((game:ServerGameSystem, adapters: FakeServerAdapters, gameEvents:GameEvent|GameEvent[]) => Test)[] = [
            thereIsClientComponents(TestStep.Given, EntityIds.match, makePhasing(EntityIds.match, scenario.phaseSequence.currentPhase)),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, EntityIds.match, makePhasing(EntityIds.match, scenario.phaseSequence.nextPhase)),
            ...scenario.additionnalTests
        ]
        serverScenario(`${Action.nextTurn} ${index + 1}`, nextTurnEvent(EntityIds.match),
            (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
                .buildEntity(EntityIds.match).withPhase(scenario.phaseSequence.currentPhase).withEntityReferences(EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]], [EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
                .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1, EntityIds.cellx2y2, EntityIds.cellx9y9, EntityIds.cellx10y10]]])).withDimension(gridDimension).save()
                .buildEntity(EntityIds.cellx0y0).withPhysicalComponent(gridFirstCellPosition, ShapeType.cell, true).save()
                .buildEntity(EntityIds.cellx1y1).withPhysicalComponent(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
                .buildEntity(EntityIds.cellx2y2).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
                .buildEntity(EntityIds.cellx9y9).withPhysicalComponent(playerBRobotFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true).save()
                .buildEntity(EntityIds.cellx10y10).withPhysicalComponent(playerBTowerFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true).save()
                .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])).save()
                .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.nextTurnButton, [EntityIds.playerBNextTurnButton]]])).save()
                .buildEntity(EntityIds.playerANextTurnButton).withPhysicalComponent(playerNextTurnButtonPosition, ShapeType.nextTurnButton, false).save()
                .buildEntity(EntityIds.playerBNextTurnButton).withPhysicalComponent(playerNextTurnButtonPosition, ShapeType.nextTurnButton, false).save()
            , tests)
    })
})
