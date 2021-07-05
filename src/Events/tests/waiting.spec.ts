import { describe, before } from 'mocha'
import { Playable } from '../../Component/Playable'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { createSimpleMatchLobbyEvent } from '../../Systems/LifeCycle/GenericLifeCycleSystem'
import { matchWaitingForPlayers, playerJoinMatchEvent } from '../../Systems/Match/ServerMatchSystem'
import { Action } from '../port/Action'
import { mainMenuEntityId, simpleMatchLobbyEntityId } from '../port/entityIds'
import { theEntityWithIdHasTheExpectedComponent, whenEventOccurs, theEventIsSent, featureEventDescription } from '../port/test'
import { TestStep } from '../port/TestStep'
import { playerWantJoinSimpleMatchLobby } from './wantToJoin.spec'
const action = Action.waitingForPlayers
describe(featureEventDescription(action), () => {
    describe('Enough players', () => {
        const adapters = new FakeServerAdapters([simpleMatchLobbyEntityId])
        const game = new ServerGameSystem(adapters)
        const expectedAddedPlayers = ['Player A', 'Player B']
        const expectedStillWaitingPlayers = ['Player C', 'Player D']
        const matchId = '0000'
        before(() => game.onGameEvent(createSimpleMatchLobbyEvent(mainMenuEntityId, simpleMatchLobbyEntityId))
            .then(() => Promise.all([...expectedAddedPlayers, ...expectedStillWaitingPlayers].map(player => game.onGameEvent(playerWantJoinSimpleMatchLobby(player)))))
        )
        theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [...expectedAddedPlayers, ...expectedStillWaitingPlayers]))
        whenEventOccurs(game, matchWaitingForPlayers(matchId))
        theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [...expectedStillWaitingPlayers]))
        theEventIsSent(TestStep.And, adapters, playerJoinMatchEvent(expectedAddedPlayers[0], matchId))
        theEventIsSent(TestStep.And, adapters, playerJoinMatchEvent(expectedAddedPlayers[1], matchId))
    })
})
