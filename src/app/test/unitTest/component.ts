import { expect } from 'chai'
import { it } from 'mocha'
import type { Component } from '../../core/ecs/component'
import type { ClientGameSystem } from '../../core/ecs/systems/ClientGameSystem'
import type { ServerGameSystem } from '../../core/ecs/systems/ServerGameSystem'
import type { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import type { FakeServerAdapters } from '../../infra/game/server/FakeServerAdapters'
import { componentDetailedComparisonMessage, hasComponents } from '../../messages'
import { isGiven, type TestStep } from '../TestStep'

export const thereIsServerComponents =
  (testStep: TestStep, expectedComponents: Component[]) =>
  (_game: ServerGameSystem, adapters: FakeServerAdapters) =>
    it(hasComponents(testStep, expectedComponents), () => {
      if (isGiven(testStep)) adapters.componentRepository.saveComponents(expectedComponents)
      let components = adapters.componentRepository.retreiveAllComponents()
      components = sortComponents(components)
      expectedComponents = sortComponents(expectedComponents)
      expect(components).deep.equal(
        expectedComponents,
        componentDetailedComparisonMessage(components, expectedComponents),
      )
    })

export const thereIsClientComponents =
  (testStep: TestStep, expectedComponents: Component[]) =>
  (_game: ClientGameSystem, adapters: FakeClientGameAdapters) =>
    it(hasComponents(testStep, expectedComponents), () => {
      if (isGiven(testStep)) adapters.componentRepository.saveComponents(expectedComponents)
      let components = adapters.componentRepository.retreiveAllComponents()
      components = sortComponents(components)
      expectedComponents = sortComponents(expectedComponents)
      expect(components).deep.equal(
        expectedComponents,
        componentDetailedComparisonMessage(components, expectedComponents),
      )
    })

const sortComponents = (components: Component[]) =>
  components.sort((a, b) => (a.componentType + a.entityId > b.componentType + b.entityId ? 1 : -1))
