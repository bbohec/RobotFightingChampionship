import { Test } from 'mocha'
import { FakeServerAdapters } from '../../../../infra/game/server/FakeServerAdapters'
import { EntityIds } from '../../../../test/entityIds'
import { feature } from '../../../../test/feature'
import { serverScenario } from '../../../../test/scenario'
import { TestStep } from '../../../../test/TestStep'
import { thereIsServerComponents } from '../../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../../test/unitTest/event'
import { Dimension, makeDimensional } from '../../components/Dimensional'
import { makeEntityReference } from '../../components/EntityReference'
import { preparingGamePhase, playerATowerAutoPlacementPhase, playerARobotAutoPlacementPhase, playerBTowerAutoPlacementPhase, playerBRobotAutoPlacementPhase, playerARobotPhase, playerBRobotPhase, playerATowerPhase, playerBTowerPhase, makePhasing } from '../../components/Phasing'
import { Position, position, makePhysical, playerNextTurnButtonPosition, playerATowerFirstPosition, playerARobotFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition } from '../../components/Physical'
import { EntityBuilder } from '../../entity/entityBuilder'
import { PhaseSequence } from '../../systems/PhasingSystem'
import { ServerGameSystem } from '../../systems/ServerGameSystem'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { GameEvent } from '../../type/GameEvent'
import { ShapeType } from '../../type/ShapeType'
import { drawEvent } from '../draw/draw'
import { moveEvent } from '../move/move'
import { nextTurnEvent } from './nextTurn'

feature(Action.nextTurn, () => {
    interface Scenario {
        number:number
        phaseSequence:PhaseSequence,
        isplayerANextTurnButtonVisible:boolean,
        isplayerBNextTurnButtonVisible:boolean,
        expectedEvents: GameEvent[]
        skip?:true
    }
    const gridDimension:Dimension = { x: 10, y: 10 }
    const gridFirstCellPosition:Position = position(0, 0)
    const scenarios:Scenario[] = [
        {
            number: 1,
            phaseSequence: {
                currentPhase: preparingGamePhase,
                nextPhase: playerATowerAutoPlacementPhase()
            },
            expectedEvents: [
                moveEvent(EntityIds.playerA, EntityType.tower, EntityIds.playerATower, EntityIds.cellx1y1)
            ],
            isplayerANextTurnButtonVisible: false,
            isplayerBNextTurnButtonVisible: false
        },
        {
            number: 2,
            phaseSequence: {
                currentPhase: playerATowerAutoPlacementPhase(),
                nextPhase: playerARobotAutoPlacementPhase()
            },
            expectedEvents: [
                moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y2)
            ],
            isplayerANextTurnButtonVisible: false,
            isplayerBNextTurnButtonVisible: false
        },
        {
            number: 3,
            phaseSequence: {
                currentPhase: playerARobotAutoPlacementPhase(),
                nextPhase: playerBTowerAutoPlacementPhase()
            },
            expectedEvents: [
                moveEvent(EntityIds.playerB, EntityType.tower, EntityIds.playerBTower, EntityIds.cellx10y10)
            ],
            isplayerANextTurnButtonVisible: false,
            isplayerBNextTurnButtonVisible: false
        },
        {
            number: 4,
            phaseSequence: {
                currentPhase: playerBTowerAutoPlacementPhase(),
                nextPhase: playerBRobotAutoPlacementPhase()
            },
            expectedEvents: [
                moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerBRobot, EntityIds.cellx9y9)
            ],
            isplayerANextTurnButtonVisible: false,
            isplayerBNextTurnButtonVisible: false
        },
        {
            number: 5,
            phaseSequence: {
                currentPhase: playerBRobotAutoPlacementPhase(),
                nextPhase: playerARobotPhase()
            },
            expectedEvents: [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ],
            isplayerANextTurnButtonVisible: true,
            isplayerBNextTurnButtonVisible: false
        },
        {
            number: 6,
            phaseSequence: {
                currentPhase: playerARobotPhase(),
                nextPhase: playerBRobotPhase()
            },
            expectedEvents: [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
            ],
            isplayerANextTurnButtonVisible: false,
            isplayerBNextTurnButtonVisible: true
        },
        {
            number: 7,
            phaseSequence: {
                currentPhase: playerBRobotPhase(),
                nextPhase: playerATowerPhase()
            },
            expectedEvents: [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ],
            isplayerANextTurnButtonVisible: true,
            isplayerBNextTurnButtonVisible: false
        },
        {
            number: 8,
            phaseSequence: {
                currentPhase: playerATowerPhase(),
                nextPhase: playerBTowerPhase()
            },
            expectedEvents: [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true))
            ],
            isplayerANextTurnButtonVisible: false,
            isplayerBNextTurnButtonVisible: true
        },
        {
            number: 9,
            phaseSequence: {
                currentPhase: playerBTowerPhase(),
                nextPhase: playerARobotPhase()
            },
            expectedEvents: [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false))
            ],
            isplayerANextTurnButtonVisible: true,
            isplayerBNextTurnButtonVisible: false
        }
    ]
    scenarios.forEach((scenario) => {
        const tests: ((game:ServerGameSystem, adapters: FakeServerAdapters, gameEvents:GameEvent|GameEvent[]) => Test)[] = [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, scenario.phaseSequence.currentPhase),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]], [EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1, EntityIds.cellx2y2, EntityIds.cellx9y9, EntityIds.cellx10y10]]])),
                makeDimensional(EntityIds.grid, gridDimension),
                makePhysical(EntityIds.cellx0y0, gridFirstCellPosition, ShapeType.cell, true),
                makePhysical(EntityIds.cellx1y1, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.cell, true),
                makePhysical(EntityIds.cellx2y2, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true),
                makePhysical(EntityIds.cellx9y9, playerBRobotFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true),
                makePhysical(EntityIds.cellx10y10, playerBTowerFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.nextTurnButton, [EntityIds.playerBNextTurnButton]]])),
                makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false),
                makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, scenario.phaseSequence.nextPhase),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]], [EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1, EntityIds.cellx2y2, EntityIds.cellx9y9, EntityIds.cellx10y10]]])),
                makeDimensional(EntityIds.grid, gridDimension),
                makePhysical(EntityIds.cellx0y0, gridFirstCellPosition, ShapeType.cell, true),
                makePhysical(EntityIds.cellx1y1, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.cell, true),
                makePhysical(EntityIds.cellx2y2, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true),
                makePhysical(EntityIds.cellx9y9, playerBRobotFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true),
                makePhysical(EntityIds.cellx10y10, playerBTowerFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.nextTurnButton, [EntityIds.playerBNextTurnButton]]])),
                makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, scenario.isplayerANextTurnButtonVisible),
                makePhysical(EntityIds.playerBNextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, scenario.isplayerBNextTurnButtonVisible)
            ]),
            eventsAreSent(TestStep.And, 'server', scenario.expectedEvents)
        ]
        serverScenario(`${Action.nextTurn} ${scenario.number}: ${scenario.phaseSequence.currentPhase.phaseType} ${scenario.phaseSequence.nextPhase.currentUnitId}  > ${scenario.phaseSequence.nextPhase.phaseType} ${scenario.phaseSequence.currentPhase.currentUnitId}`, nextTurnEvent(EntityIds.match),
            [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
                .buildEntity(EntityIds.match).withPhase(scenario.phaseSequence.currentPhase).withEntityReferences(EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]], [EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
                .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx0y0, EntityIds.cellx1y1, EntityIds.cellx2y2, EntityIds.cellx9y9, EntityIds.cellx10y10]]])).withDimension(gridDimension).save()
                .buildEntity(EntityIds.cellx0y0).withPhysical(gridFirstCellPosition, ShapeType.cell, true).save()
                .buildEntity(EntityIds.cellx1y1).withPhysical(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
                .buildEntity(EntityIds.cellx2y2).withPhysical(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
                .buildEntity(EntityIds.cellx9y9).withPhysical(playerBRobotFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true).save()
                .buildEntity(EntityIds.cellx10y10).withPhysical(playerBTowerFirstPosition(gridFirstCellPosition, gridDimension), ShapeType.cell, true).save()
                .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.nextTurnButton, [EntityIds.playerANextTurnButton]]])).save()
                .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.nextTurnButton, [EntityIds.playerBNextTurnButton]]])).save()
                .buildEntity(EntityIds.playerANextTurnButton).withPhysical(playerNextTurnButtonPosition, ShapeType.nextTurnButton, false).save()
                .buildEntity(EntityIds.playerBNextTurnButton).withPhysical(playerNextTurnButtonPosition, ShapeType.nextTurnButton, false).save()
            , tests, undefined, scenario.skip)
    })
})
