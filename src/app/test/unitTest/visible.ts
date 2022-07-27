import { expect } from 'chai'
import { it } from 'mocha'
import { Physical } from '../../core/components/Physical'
import { GenericGameSystem } from '../../core/system/GenericGameSystem'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { entityIsNotVisibleMessage, entityIsVisibleMessage } from '../../messages'
import { TestStep } from '../TestStep'

export const entityIsNotVisible = (
    testStep:TestStep,
    expectedPhysicalComponent:Physical
) => (game:GenericGameSystem, adapters:FakeClientGameAdapters) => it(entityIsNotVisibleMessage(testStep, expectedPhysicalComponent.entityId),
    () => expect(adapters.drawingInteractor.drawEntities.get(expectedPhysicalComponent.entityId))
        .to.not.be.deep.equal(expectedPhysicalComponent))

export const entityIsVisible = (
    testStep:TestStep,
    expectedPhysicalComponent:Physical
) => (game:GenericGameSystem, adapters:FakeClientGameAdapters) => it(entityIsVisibleMessage(testStep, expectedPhysicalComponent.entityId),
    () => expect(adapters.drawingInteractor.drawEntities.get(expectedPhysicalComponent.entityId))
        .to.be.deep.equal(expectedPhysicalComponent))
