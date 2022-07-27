import { expect } from 'chai'
import { it } from 'mocha'
import { TestStep } from '../../Event/TestStep'
import { thereIsANotificationMessage } from '../../messages'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'

export const thereIsANotification = (
    testStep:TestStep,
    adapters: FakeClientAdapters,
    notification:string
) => it(thereIsANotificationMessage(testStep, notification),
    () => expect(adapters
        .notificationInteractor
        .notifications)
        .include(notification))
