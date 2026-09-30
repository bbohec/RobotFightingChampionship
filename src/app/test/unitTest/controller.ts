import { expect } from 'chai'
import { it, type Test } from 'mocha'
import type { ClientGameSystem } from '../../core/ecs/systems/ClientGameSystem'
import type { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import {
  theControllerAdapterIsInteractiveMessage,
  theControllerAdapterIsNotInteractiveMessage,
} from '../../messages'
import type { TestStep } from '../TestStep'

export const theControllerAdapterIsInteractive =
  (testStep: TestStep) =>
  (_game: ClientGameSystem, adapters: FakeClientGameAdapters): Test =>
    it(
      theControllerAdapterIsInteractiveMessage(testStep),
      () => expect(adapters.controllerAdapter.isInteractive).to.be.true,
    )

export const theControllerAdapterIsNotInteractive =
  (testStep: TestStep) =>
  (_game: ClientGameSystem, adapters: FakeClientGameAdapters): Test =>
    it(
      theControllerAdapterIsNotInteractiveMessage(testStep),
      () => expect(adapters.controllerAdapter.isInteractive).to.be.false,
    )
