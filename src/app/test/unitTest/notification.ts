import { expect } from 'chai'
import { it, Test } from 'mocha'
import { ClientGameSystem } from '../../core/ecs/systems/ClientGameSystem'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { thereIsANotificationMessage } from '../../messages'
import { TestStep } from '../TestStep'

export const thereIsANotification = (
    testStep:TestStep,
    notification:string
) => (game: ClientGameSystem, adapters:FakeClientGameAdapters):Test => it(thereIsANotificationMessage(testStep, notification),
    () => expect(adapters
        .notificationInteractor
        .notifications)
        .include(notification))
