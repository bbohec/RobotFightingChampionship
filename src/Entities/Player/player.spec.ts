import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { newEvent } from '../../Events/port/GameEvents'
import { whenEventOccurs } from '../../Events/port/test'
import { LifeCycle } from '../../Component/LifeCycle'
import { Player } from './Player'
import { EntityReference } from '../../Component/EntityReference'
import { Match } from '../Match/Match'
import { Playable } from '../../Component/Playable'
import { ServerGame } from '../../Systems/Game/ServerGame'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'

describe('Feature Player', () => {
    const playerId = 'Player A'
    const towerId = 'Tower'
    const robotId = 'Robot'
    const createPlayerEvent = newEvent(Action.create, EntityType.nothing, EntityType.player)
    const registerTowerOnPlayerEvent = newEvent(Action.register, EntityType.tower, EntityType.player, playerId, towerId)
    const registerRobotOnPlayerEvent = newEvent(Action.register, EntityType.robot, EntityType.player, playerId, robotId)
    describe('Player : on create', () => {
        const adapters = new FakeServerAdapters([playerId])
        const game = new ServerGame(adapters)
        it('Given there is no player', () => {
            expect(() => adapters.entityInteractor.retrieveEntityByClass(Player)).to.throw()
        })
        whenEventOccurs(game, createPlayerEvent)
        it('Then the player is created', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(Player).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it('And the Match has a EntityReference component without references.', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(Player).retrieveComponent(EntityReference).entityReferences.size).equal(0)
        })
    })
    describe('Player : on Register Tower', () => {
        const adapters = new FakeServerAdapters([playerId])
        const game = new ServerGame(adapters)
        before(() => game.onGameEvent(createPlayerEvent))
        it(`Given a player with Id ${playerId}`, () => {
            expect(adapters.entityInteractor.retrieveEntityById(playerId).id).equal(playerId)
        })
        whenEventOccurs(game, registerTowerOnPlayerEvent)
        it(`Then the Player has a ${EntityType.tower} Reference with ${towerId}`, () => {
            expect(adapters.entityInteractor.retrieveEntityById(playerId).retrieveComponent(EntityReference).entityReferences.get(towerId)).equal(EntityType.tower)
        })
    })
    describe('Player : on Register Robot', () => {
        const adapters = new FakeServerAdapters([playerId])
        const game = new ServerGame(adapters)
        before(() => game.onGameEvent(createPlayerEvent))
        it(`Given a player with Id ${playerId}`, () => {
            expect(adapters.entityInteractor.retrieveEntityById(playerId).id).equal(playerId)
        })
        whenEventOccurs(game, registerRobotOnPlayerEvent)
        it(`Then the Player has a ${EntityType.robot} Reference with ${robotId}`, () => {
            expect(adapters.entityInteractor.retrieveEntityById(playerId).retrieveComponent(EntityReference).entityReferences.get(robotId)).equal(EntityType.robot)
        })
    })
    describe('Player : on Register Robot & Tower', () => {
        const adapters = new FakeServerAdapters([playerId])
        const game = new ServerGame(adapters)
        const matchId = 'MATCH'
        const matchEntity = new Match(matchId)
        matchEntity.addComponent(new Playable(matchId))
        matchEntity.retrieveComponent(Playable).players.push(playerId)
        adapters.entityInteractor.addEntity(matchEntity)
        before(() => game.onGameEvent(createPlayerEvent))
        it(`Given a player with Id ${playerId}`, () => {
            expect(adapters.entityInteractor.retrieveEntityById(playerId).id).equal(playerId)
        })
        whenEventOccurs(game, registerRobotOnPlayerEvent)
        whenEventOccurs(game, registerTowerOnPlayerEvent)
        const playerReadyForMatch = newEvent(Action.ready, EntityType.player, EntityType.match, matchId, playerId)
        it(`Then the event "${playerReadyForMatch.action}" is sent to "${playerReadyForMatch.targetEntityType}" for the game "${playerReadyForMatch.originEntityId}"`, () => {
            expect(adapters.eventInteractor.hasEvent(playerReadyForMatch)).is.true
        })
    })
})
