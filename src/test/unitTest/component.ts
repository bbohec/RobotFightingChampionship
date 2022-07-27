import { expect } from 'chai'
import { it } from 'mocha'
import { Component } from '../../app/core/component/Component'
import { ClientGameSystem } from '../../app/core/systems/ClientGameSystem'
import { ServerGameSystem } from '../../app/core/systems/ServerGameSystem'
import { hasComponents, componentDetailedComparisonMessage } from '../../app/messages'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { FakeServerAdapters } from '../../infra/game/server/FakeServerAdapters'
import { TestStep } from '../TestStep'

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
) => (game:ClientGameSystem, adapters:FakeClientGameAdapters) => it(hasComponents(testStep, expectedComponents),
    () => {
        const components = adapters
            .entityInteractor.retreiveAllComponents()
        expect(components).deep.equal(expectedComponents, componentDetailedComparisonMessage(components, expectedComponents))
    })
