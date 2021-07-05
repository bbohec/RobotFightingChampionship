import { describe, before } from 'mocha'
import { Playable } from '../../Component/Playable'
import { Game } from '../../Entities/ClientGame/Game'
import { ClientGameSystem } from '../../Systems/Game/ClientGame'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { createGameEvent, createGridEvent, createMatchEvent, createRobotEvent, createTowerEvent } from '../../Systems/LifeCycle/GenericLifeCycleSystem'
import { playerJoinMatchEvent } from '../../Systems/Match/ServerMatchSystem'
import { Action } from '../port/Action'
import { matchId, playerAId, playerBId } from '../port/entityIds'
import { EntityType } from '../port/EntityType'
import { newEvent } from '../port/GameEvents'
import { featureEventDescription, theEntityIsCreated, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../port/test'
import { TestStep } from '../port/TestStep'

describe(featureEventDescription(Action.playerJoinMatch), () => {
    describe('Scenario : Join simple match', () => {
        const adapters = new FakeClientAdapters()
        const game = new ClientGameSystem(adapters)
        const playerId = 'Player A'
        const joinSimpleMatchClientEvent = newEvent(Action.wantToJoin, EntityType.nothing, EntityType.game, undefined, playerId)
        const joinSimpleMatchServerEvent = newEvent(Action.wantToJoin, EntityType.nothing, EntityType.game, undefined, playerId)
        const matchMakingShowEvent = newEvent(Action.show, EntityType.nothing, EntityType.matchMaking)
        const mainMenuHideEvent = newEvent(Action.hide, EntityType.nothing, EntityType.mainMenu)
        before(() => game.onGameEvent(createGameEvent))
        theEntityIsCreated(TestStep.Given, adapters, Game)
        whenEventOccurs(game, joinSimpleMatchClientEvent)
        theEventIsSent(TestStep.Then, adapters, joinSimpleMatchServerEvent)
        theEventIsSent(TestStep.And, adapters, mainMenuHideEvent)
        theEventIsSent(TestStep.And, adapters, matchMakingShowEvent)
    })
    describe('Scenario :On player join match as first player', () => {
        const adapters = new FakeServerAdapters([matchId])
        const game = new ServerGameSystem(adapters)
        before(() => game.onGameEvent(createMatchEvent))
        theEntityIsOnRepository(TestStep.Given, adapters, matchId)
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Playable, new Playable(matchId, []))
        whenEventOccurs(game, playerJoinMatchEvent(playerAId, matchId))
        theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Playable, new Playable(matchId, [playerAId]))
    })
    describe('Scenario :On player join match as second player', () => {
        const adapters = new FakeServerAdapters([matchId])
        const game = new ServerGameSystem(adapters)
        before(() => game.onGameEvent(createMatchEvent).then(() => game.onGameEvent(playerJoinMatchEvent(playerAId, matchId))))
        theEntityIsOnRepository(TestStep.Given, adapters, matchId)
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Playable, new Playable(matchId, [playerAId]))
        whenEventOccurs(game, playerJoinMatchEvent(playerBId, matchId))
        theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Playable, new Playable(matchId, [playerAId, playerBId]));
        ([
            createTowerEvent(playerAId),
            createRobotEvent(playerAId),
            createTowerEvent(playerBId),
            createRobotEvent(playerBId),
            createGridEvent(matchId)
        ]).forEach(event => theEventIsSent(TestStep.And, adapters, event))
    })
})
