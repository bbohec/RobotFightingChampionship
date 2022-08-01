import { expect } from 'chai'
import { it } from 'mocha'
import { Physical } from '../../core/ecs/components/Physical'
import { GenericGameSystem } from '../../core/ecs/system'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { componentDetailedComparisonMessage, entityIsNotVisibleMessage } from '../../messages'
import { isGiven, TestStep } from '../TestStep'

export const componentsAreVisible = (
    testStep:TestStep,
    expectedPhysicalComponents:Physical[]
) => (game:GenericGameSystem, adapters:FakeClientGameAdapters) => it(entityIsNotVisibleMessage(testStep, expectedPhysicalComponents),
    () => {
        if (isGiven(testStep)) expectedPhysicalComponents.forEach(component => adapters.drawingInteractor.drawEntities.set(component.entityId, component))
        const components = [...adapters.drawingInteractor.drawEntities.values()]
        return expect(components)
            .to.be.deep.equal(expectedPhysicalComponents, componentDetailedComparisonMessage(components, expectedPhysicalComponents))
    })
/*
export const hasDrawPhysicalComponent = (
    testStep:TestStep,
    expectedPhysicalComponent:Physical
) => (game:GenericGameSystem, adapters:FakeClientGameAdapters) => it(entityIsVisibleMessage(testStep, expectedPhysicalComponent.entityId),
    () => {
        if (isGiven(testStep)) adapters.drawingInteractor.refreshEntity(adapters.componentRepository.retrievePhysical(expectedPhysicalComponent.entityId))
        const component = adapters.drawingInteractor.drawEntities.get(expectedPhysicalComponent.entityId)
        if (!component) throw new Error(`Component ${expectedPhysicalComponent.entityId} is not visible`)
        return expect(component)
            .to.be.deep.equal(expectedPhysicalComponent, componentDetailedComparisonMessage([component], [expectedPhysicalComponent]))
    })
*/
