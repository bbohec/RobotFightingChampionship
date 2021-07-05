import {
    describe,
    // before,
    it
} from 'mocha'
import { expect } from 'chai'
import { newEvent } from '../../Events/port/GameEvents'
import { LifeCycle } from '../../Component/LifeCycle'
import { Grid } from './Grid'
import { Dimension, Dimensional } from '../../Component/Dimensional'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { whenEventOccurs } from '../../Events/port/test'
import { ServerGame } from '../../Systems/Game/ServerGame'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'

const entityName = 'Grid'
describe(`Feature : ${entityName}`, () => {
    describe('On create', () => {
        const matchId = '0000'
        const gridId = 'grid'
        const adapters = new FakeServerAdapters([gridId])
        const game = new ServerGame(adapters)
        const expectedDimention:Dimension = { x: 25, y: 25 }
        const registerGridOnMatchEvent = newEvent(Action.register, EntityType.nothing, EntityType.match, matchId, gridId)
        const createGridEvent = (matchId:string) => newEvent(Action.create, EntityType.nothing, EntityType.grid, undefined, matchId)
        it(`Given there is no ${entityName}`, () => {
            expect(() => adapters.entityInteractor.retrieveEntityByClass(Grid)).to.throw()
        })
        whenEventOccurs(game, createGridEvent(matchId))
        it(`Then the ${entityName} is created`, () => {
            expect(adapters.entityInteractor.retrieveEntityById(gridId).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it(`And the ${entityName} has the following dimensions : ${JSON.stringify(expectedDimention)}`, () => {
            expect(adapters.entityInteractor.retrieveEntityById(gridId).retrieveComponent(Dimensional).dimensions).deep.equal(expectedDimention)
        })
        it(`And the event "${registerGridOnMatchEvent.action}" is sent to "${registerGridOnMatchEvent.targetEntityType}" for the game "${registerGridOnMatchEvent.originEntityId}"`, () => {
            expect(adapters.eventInteractor.hasEvent(registerGridOnMatchEvent)).is.true
        })
    })
})
