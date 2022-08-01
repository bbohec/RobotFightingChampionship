import { expect } from 'chai'
import { it } from 'mocha'
import { Component } from '../../core/ecs/component'
import { ClientGameSystem } from '../../core/ecs/systems/ClientGameSystem'
import { ServerGameSystem } from '../../core/ecs/systems/ServerGameSystem'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { FakeServerAdapters } from '../../infra/game/server/FakeServerAdapters'
import { hasComponents, componentDetailedComparisonMessage } from '../../messages'
import { TestStep } from '../TestStep'

export const thereIsServerComponents = (
    testStep:TestStep,
    expectedComponents: Component[]
) => (game:ServerGameSystem, adapters:FakeServerAdapters) => it(hasComponents(testStep, expectedComponents),
    () => {
        let components = adapters
            .componentRepository.retreiveAllComponents()
        components = sortComponents(components)
        expectedComponents = sortComponents(expectedComponents)
        expect(components).deep.equal(expectedComponents, componentDetailedComparisonMessage(components, expectedComponents))
    })

export const thereIsClientComponents = (
    testStep:TestStep,
    expectedComponents: Component[]
) => (game:ClientGameSystem, adapters:FakeClientGameAdapters) => it(hasComponents(testStep, expectedComponents),
    () => {
        let components = adapters
            .componentRepository.retreiveAllComponents()
        components = sortComponents(components)
        expectedComponents = sortComponents(expectedComponents)
        expect(components).deep.equal(expectedComponents, componentDetailedComparisonMessage(components, expectedComponents))
    })

const sortComponents = (components:Component[]) => components.sort((a, b) => (a.componentType + a.entityId) > (b.componentType + b.entityId) ? 1 : -1)
