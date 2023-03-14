import { expect } from 'chai'
import { it, Test } from 'mocha'
import { ClientGameSystem } from '../../core/ecs/systems/ClientGameSystem'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { theControllerAdapterIsInteractiveMessage, theControllerAdapterIsNotInteractiveMessage } from '../../messages'
import { TestStep } from '../TestStep'

export const theControllerAdapterIsInteractive = (
    testStep:TestStep

) => (game: ClientGameSystem, adapters: FakeClientGameAdapters):Test => it(theControllerAdapterIsInteractiveMessage(testStep),
    () => expect(adapters.controllerAdapter.isInteractive)
        .to.be.true)

export const theControllerAdapterIsNotInteractive = (
    testStep:TestStep
) => (game: ClientGameSystem, adapters: FakeClientGameAdapters):Test => it(theControllerAdapterIsNotInteractiveMessage(testStep),
    () => expect(adapters.controllerAdapter.isInteractive)
        .to.be.false)
