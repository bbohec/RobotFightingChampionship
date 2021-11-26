import { Test } from 'mocha'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition } from '../../Components/Physical'
import { moveEvent } from '../move/move'
import { nextTurnEvent } from './nextTurn'
import { PhaseSequence } from '../../Systems/Phasing/PhasingSystem'
import { Phasing, playerARobotAutoPlacementPhase, playerARobotPhase, playerATowerAutoPlacementPhase, playerATowerPhase, playerBRobotAutoPlacementPhase, playerBRobotPhase, playerBTowerAutoPlacementPhase, playerBTowerPhase, preparingGamePhase } from '../../Components/Phasing'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
import { ShapeType } from '../../Components/port/ShapeType'
import { gridDimension } from '../../Components/port/Dimension'

feature(featureEventDescription(Action.nextTurn), () => {
    interface Scenario {
        phaseSequence:PhaseSequence,
        additionnalEventConsequence:GameEvent[]
    }
    const scenarios:Scenario[] = [
        {
            phaseSequence: {
                currentPhase: preparingGamePhase,
                nextPhase: playerATowerAutoPlacementPhase()
            },
            additionnalEventConsequence: [
                moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx1y1)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerATowerAutoPlacementPhase(),
                nextPhase: playerARobotAutoPlacementPhase()
            },
            additionnalEventConsequence: [
                moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx2y2)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerARobotAutoPlacementPhase(),
                nextPhase: playerBTowerAutoPlacementPhase()
            },
            additionnalEventConsequence: [
                moveEvent(EntityId.playerB, EntityType.tower, EntityId.playerBTower, EntityId.cellx10y10)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBTowerAutoPlacementPhase(),
                nextPhase: playerBRobotAutoPlacementPhase()
            },
            additionnalEventConsequence: [
                moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerBRobot, EntityId.cellx9y9)
            ]
        },
        {
            phaseSequence: {
                currentPhase: playerBRobotAutoPlacementPhase(),
                nextPhase: playerARobotPhase()
            },
            additionnalEventConsequence: []
        },
        {
            phaseSequence: {
                currentPhase: playerARobotPhase(),
                nextPhase: playerBRobotPhase()
            },
            additionnalEventConsequence: []
        },
        {
            phaseSequence: {
                currentPhase: playerBRobotPhase(),
                nextPhase: playerATowerPhase()
            },
            additionnalEventConsequence: []
        },
        {
            phaseSequence: {
                currentPhase: playerATowerPhase(),
                nextPhase: playerBTowerPhase()
            },
            additionnalEventConsequence: []
        },
        {
            phaseSequence: {
                currentPhase: playerBTowerPhase(),
                nextPhase: playerARobotPhase()
            },
            additionnalEventConsequence: []
        }
    ]
    scenarios.forEach((scenario, index) => {
        const tests: ((game:ServerGameSystem, adapters: FakeServerAdapters, gameEvents:GameEvent|GameEvent[]) => Test)[] = [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, scenario.phaseSequence.currentPhase)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, scenario.phaseSequence.nextPhase))
        ]
        if (scenario.additionnalEventConsequence) tests.push((game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', scenario.additionnalEventConsequence))
        serverScenario(`${Action.nextTurn} ${index + 1}`, nextTurnEvent(EntityId.match),
            (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
                .buildEntity(EntityId.match).withPhase(scenario.phaseSequence.currentPhase).withEntityReferences(EntityType.match, new Map([[EntityType.grid, [EntityId.grid]]])).withPlayers([EntityId.playerA, EntityId.playerB]).save()
                .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.cell, [EntityId.cellx1y1, EntityId.cellx2y2, EntityId.cellx9y9, EntityId.cellx10y10]]])).withDimension(gridDimension).save()
                .buildEntity(EntityId.cellx1y1).withPhysicalComponent(playerATowerFirstPosition(), ShapeType.cell, true).save()
                .buildEntity(EntityId.cellx2y2).withPhysicalComponent(playerARobotFirstPosition(), ShapeType.cell, true).save()
                .buildEntity(EntityId.cellx9y9).withPhysicalComponent(playerBRobotFirstPosition(gridDimension), ShapeType.cell, true).save()
                .buildEntity(EntityId.cellx10y10).withPhysicalComponent(playerBTowerFirstPosition(gridDimension), ShapeType.cell, true).save()
                .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]]])).save()
                .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]]])).save()
            , tests)
    })
    serverScenario('Unit position on grid scale', nextTurnEvent(EntityId.match), undefined, [
        ...whenEventOccured()
    ], undefined, true)
})
