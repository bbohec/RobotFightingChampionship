import { describe, before } from 'mocha'
import { Action } from '../port/Action'
import { EntityType } from '../port/EntityType'
import { gridId, matchId, playerAId, robotId, towerId } from '../port/entityIds'
import { featureEventDescription, scenarioEventDescription, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../port/test'
import { EntityReference } from '../../Component/EntityReference'
import { Playable } from '../../Component/Playable'
import { Match } from '../../Entities/Match/Match'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { TestStep } from '../port/TestStep'
import { createMatchEvent, createPlayerEvent } from '../../Systems/LifeCycle/GenericLifeCycleSystem'
import { registerTowerEvent, registerRobotEvent, registerGridEvent } from '../../Systems/Match/ServerMatchSystem'
import { playerReadyForMatch } from '../../Systems/Phasing/PhasingSystem'
describe(featureEventDescription(Action.register), () => {
    describe(scenarioEventDescription(registerTowerEvent(towerId, playerAId), 'server'), () => {
        const adapters = new FakeServerAdapters([playerAId])
        const game = new ServerGameSystem(adapters)
        before(() => game.onGameEvent(createPlayerEvent))
        theEntityIsOnRepository(TestStep.Given, adapters, playerAId)
        whenEventOccurs(game, registerTowerEvent(towerId, playerAId))
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[towerId, EntityType.tower]])))
    })
    describe(scenarioEventDescription(registerRobotEvent(robotId, playerAId), 'server'), () => {
        const adapters = new FakeServerAdapters([playerAId])
        const game = new ServerGameSystem(adapters)
        before(() => game.onGameEvent(createPlayerEvent))
        theEntityIsOnRepository(TestStep.Given, adapters, playerAId)
        whenEventOccurs(game, registerRobotEvent(robotId, playerAId))
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[robotId, EntityType.robot]])))
    })
    describe(scenarioEventDescription([registerRobotEvent(robotId, playerAId), registerTowerEvent(towerId, playerAId)], 'server'), () => {
        const adapters = new FakeServerAdapters([playerAId])
        const game = new ServerGameSystem(adapters)
        const matchEntity = new Match(matchId)
        matchEntity.addComponent(new Playable(matchId, [playerAId]))
        adapters.entityInteractor.addEntity(matchEntity)
        before(() => game.onGameEvent(createPlayerEvent))
        theEntityIsOnRepository(TestStep.Given, adapters, playerAId)
        whenEventOccurs(game, registerRobotEvent(robotId, playerAId))
        whenEventOccurs(game, registerTowerEvent(towerId, playerAId))
        theEventIsSent(TestStep.Then, adapters, playerReadyForMatch(matchId, playerAId))
    })
    describe('On register Grid On Match Event ', () => {
        const adapters = new FakeServerAdapters([matchId])
        const game = new ServerGameSystem(adapters)
        before(() => game.onGameEvent(createMatchEvent))
        theEntityIsOnRepository(TestStep.Given, adapters, matchId)
        whenEventOccurs(game, registerGridEvent(matchId, gridId))
        theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, EntityReference, new EntityReference(matchId, new Map([['gridId', EntityType.grid]])))
    })
})
