import {
    describe,
    // before,
    it
} from 'mocha'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
// import { expect } from 'chai'
import { newEvent } from '../../Events/port/GameEvents'
describe('Feature : Robot', () => {
    describe('On create', () => {
        const player = 'Player A'
        const createRobotEventPlayer = newEvent(Action.create, EntityType.robot, undefined, player)
        it.skip('Given there is no Robot', () => {
            // expect(() => entityRepository.retrieveEntityByClass(Match)).to.throw()
        })
        it.skip(`When the event with message '${createRobotEventPlayer.action}' and destination '${createRobotEventPlayer.targetEntityType}'`, () => {
            // return serverGameEventSystem.onGameEvent(createMatchEvent)
        })
        it.skip('Then the Robot is created', () => {
            // expect(entityRepository.retrieveEntityByClass(Match).retrieveComponent(LifeCycle).isCreated).is.true
        })
    })
})
