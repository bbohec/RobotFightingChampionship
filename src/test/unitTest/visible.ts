import { expect } from 'chai'
import { it } from 'mocha'
import { Physical } from '../../Components/Physical'
import { TestStep } from '../../Event/TestStep'
import { entityIsNotVisibleMessage, entityIsVisibleMessage } from '../../messages'
import { GenericGameSystem } from '../../Systems/Game/GenericGame'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'

export const entityIsNotVisible = (
    testStep:TestStep,
    expectedPhysicalComponent:Physical
) => (game:GenericGameSystem, adapters:FakeClientAdapters) => it(entityIsNotVisibleMessage(testStep, expectedPhysicalComponent.entityId),
    () => expect(adapters.drawingInteractor.drawEntities.get(expectedPhysicalComponent.entityId))
        .to.not.be.deep.equal(expectedPhysicalComponent))

export const entityIsVisible = (
    testStep:TestStep,
    expectedPhysicalComponent:Physical
) => (game:GenericGameSystem, adapters:FakeClientAdapters) => it(entityIsVisibleMessage(testStep, expectedPhysicalComponent.entityId),
    () => expect(adapters.drawingInteractor.drawEntities.get(expectedPhysicalComponent.entityId))
        .to.be.deep.equal(expectedPhysicalComponent))
