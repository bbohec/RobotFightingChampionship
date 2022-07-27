import { expect } from 'chai'
import { it } from 'mocha'
import { thereIsANotificationMessage } from '../../app/messages'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
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
