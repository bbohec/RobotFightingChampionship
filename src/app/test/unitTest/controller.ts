import { expect } from 'chai'
import { it } from 'mocha'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { theControllerAdapterIsInteractiveMessage, theControllerAdapterIsNotInteractiveMessage } from '../../messages'
import { TestStep } from '../TestStep'

export const theControllerAdapterIsInteractive = (
    testStep:TestStep,
    adapters: FakeClientGameAdapters
) => it(theControllerAdapterIsInteractiveMessage(testStep),
    () => expect(adapters.controllerAdapter.isInteractive)
        .to.be.true)

export const theControllerAdapterIsNotInteractive = (
    testStep:TestStep,
    adapters: FakeClientGameAdapters
) => it(theControllerAdapterIsNotInteractiveMessage(testStep),
    () => expect(adapters.controllerAdapter.isInteractive)
        .to.be.false)
