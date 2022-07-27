import { expect } from 'chai'
import { it } from 'mocha'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { thereIsANotificationMessage } from '../../messages'
import { TestStep } from '../TestStep'

export const thereIsANotification = (
    testStep:TestStep,
    adapters: FakeClientGameAdapters,
    notification:string
) => it(thereIsANotificationMessage(testStep, notification),
    () => expect(adapters
        .notificationInteractor
        .notifications)
        .include(notification))
