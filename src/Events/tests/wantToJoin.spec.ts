import { describe, before } from 'mocha'
import { Playable } from '../../Component/Playable'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { createSimpleMatchLobbyEvent, createMatchEvent } from '../../Systems/LifeCycle/GenericLifeCycleSystem'
import { Action } from '../port/Action'
import { mainMenuEntityId, playerAId, players, simpleMatchLobbyEntityId } from '../port/entityIds'
import { EntityType } from '../port/EntityType'
import { newEvent } from '../port/GameEvents'
import { theEntityIsCreated, whenEventOccurs, theEntityWithIdHasTheExpectedComponent, theEventIsSent, featureEventDescription } from '../port/test'
import { TestStep } from '../port/TestStep'
const action = Action.wantToJoin
export const playerWantJoinSimpleMatchLobby = (player:string) => newEvent(action, EntityType.nothing, EntityType.simpleMatchLobby, undefined, player)
describe(featureEventDescription(action), () => {
    describe('Scenario :On one Player want to join simple match', () => {
        const adapters = new FakeServerAdapters([simpleMatchLobbyEntityId])
        const game = new ServerGameSystem(adapters)
        before(() => game.onGameEvent(createSimpleMatchLobbyEvent(mainMenuEntityId, 'unknown')))
        theEntityIsCreated(TestStep.Given, adapters, simpleMatchLobbyEntityId)
        whenEventOccurs(game, playerWantJoinSimpleMatchLobby(playerAId))
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [playerAId]))
    })
    describe(`Scenario :On ${players.length} Players want to join simple match`, () => {
        const adapters = new FakeServerAdapters([simpleMatchLobbyEntityId])
        const game = new ServerGameSystem(adapters)
        before(() => game.onGameEvent(createSimpleMatchLobbyEvent(mainMenuEntityId, 'unknown')))
        theEntityIsCreated(TestStep.Given, adapters, simpleMatchLobbyEntityId)
        players.forEach(player => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(player)))
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, players))
        theEventIsSent(TestStep.And, adapters, createMatchEvent, players.length / 2 - (players.length % 2 / 2))
    })
})
