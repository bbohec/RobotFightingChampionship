import { describe } from 'mocha'
import { Phasing } from '../../Components/Phasing'
import { PhaseType } from '../../Components/port/Phase'
import { Match } from '../../Entities/Match'
import { Action } from '../../Event/Action'
import { matchId } from '../../Event/entityIds'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { nextTurnEvent } from './nextTurnEvent'
describe(featureEventDescription(Action.nextTurn), () => {
    interface Scenario {
        currentPhase:PhaseType,
        nextPhase:PhaseType
    }
    const scenarios:Scenario[] = [
        { currentPhase: PhaseType.PlayerATowerPlacement, nextPhase: PhaseType.PlayerARobotPlacement },
        { currentPhase: PhaseType.PlayerARobotPlacement, nextPhase: PhaseType.PlayerBTowerPlacement },
        { currentPhase: PhaseType.PlayerBTowerPlacement, nextPhase: PhaseType.PlayerBRobotPlacement },
        { currentPhase: PhaseType.PlayerBRobotPlacement, nextPhase: PhaseType.PlayerARobot },
        { currentPhase: PhaseType.PlayerARobot, nextPhase: PhaseType.PlayerBRobot },
        { currentPhase: PhaseType.PlayerBRobot, nextPhase: PhaseType.PlayerATower },
        { currentPhase: PhaseType.PlayerATower, nextPhase: PhaseType.PlayerBTower },
        { currentPhase: PhaseType.PlayerBTower, nextPhase: PhaseType.PlayerARobot }
    ]
    scenarios.forEach(scenario => {
        serverScenario(nextTurnEvent(matchId), undefined,
            (game, adapters) => () => {
                const match = new Match(matchId)
                match.addComponent(new Phasing(matchId, scenario.currentPhase))
                adapters.entityInteractor.addEntity(match)
            }, [
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, scenario.currentPhase)),
                (game, adapters) => whenEventOccurs(game, nextTurnEvent(matchId)),
                (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Phasing, new Phasing(matchId, scenario.nextPhase))
            ])
    })
/*
    serverScenario(nextTurnEvent(matchId), undefined,
        (game, adapters) => () => {
            const match = new Match(matchId)
            match.addComponent(new Phasing(matchId, Phase.PlayerARobotPlacement))
            adapters.entityInteractor.addEntity(match)
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, Phase.PlayerARobotPlacement)),
            (game, adapters) => whenEventOccurs(game, nextTurnEvent(matchId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Phasing, new Phasing(matchId, Phase.PlayerBTowerPlacement))
        ])
    serverScenario(nextTurnEvent(matchId), undefined,
        (game, adapters) => () => {
            const match = new Match(matchId)
            match.addComponent(new Phasing(matchId, Phase.PlayerBTowerPlacement))
            adapters.entityInteractor.addEntity(match)
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, Phase.PlayerBTowerPlacement)),
            (game, adapters) => whenEventOccurs(game, nextTurnEvent(matchId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Phasing, new Phasing(matchId, Phase.PlayerBRobotPlacement))
        ])
    serverScenario(nextTurnEvent(matchId), undefined,
        (game, adapters) => () => {
            const match = new Match(matchId)
            match.addComponent(new Phasing(matchId, Phase.PlayerBRobotPlacement))
            adapters.entityInteractor.addEntity(match)
        }, [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, Phase.PlayerBRobotPlacement)),
            (game, adapters) => whenEventOccurs(game, nextTurnEvent(matchId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Phasing, new Phasing(matchId, Phase.PlayerATower))
        ])
        */
})
