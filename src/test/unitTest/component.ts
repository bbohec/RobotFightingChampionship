import { expect } from 'chai'
import { it } from 'mocha'
import { Component } from '../../Components/port/Component'
import { TestStep } from '../../Event/TestStep'
import { hasComponents, componentDetailedComparisonMessage } from '../../messages'
import { ClientGameSystem } from '../../Systems/Game/ClientGame'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'

export const thereIsServerComponents = (
    testStep:TestStep,
    expectedComponents: Component[]
) => (game:ServerGameSystem, adapters:FakeServerAdapters) => it(hasComponents(testStep, expectedComponents),
    () => {
        const components = adapters
            .entityInteractor.retreiveAllComponents()
        expect(components).deep.equal(expectedComponents, componentDetailedComparisonMessage(components, expectedComponents))
    })

export const thereIsClientComponents = (
    testStep:TestStep,
    expectedComponents: Component[]
) => (game:ClientGameSystem, adapters:FakeClientAdapters) => it(hasComponents(testStep, expectedComponents),
    () => {
        const components = adapters
            .entityInteractor.retreiveAllComponents()
        expect(components).deep.equal(expectedComponents, componentDetailedComparisonMessage(components, expectedComponents))
    })
