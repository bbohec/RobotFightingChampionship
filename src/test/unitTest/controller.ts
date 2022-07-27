import { expect } from 'chai'
import { it } from 'mocha'
import { TestStep } from '../TestStep'
import { theControllerAdapterIsInteractiveMessage, theControllerAdapterIsNotInteractiveMessage } from '../../messages'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'

export const theControllerAdapterIsInteractive = (
    testStep:TestStep,
    adapters: FakeClientAdapters
) => it(theControllerAdapterIsInteractiveMessage(testStep),
    () => expect(adapters.controllerAdapter.isInteractive)
        .to.be.true)

export const theControllerAdapterIsNotInteractive = (
    testStep:TestStep,
    adapters: FakeClientAdapters
) => it(theControllerAdapterIsNotInteractiveMessage(testStep),
    () => expect(adapters.controllerAdapter.isInteractive)
        .to.be.false)
