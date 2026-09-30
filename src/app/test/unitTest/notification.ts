import { expect } from 'chai'
import { it, type Test } from 'mocha'
import type { ClientGameSystem } from '../../core/ecs/systems/ClientGameSystem'
import type { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { thereIsANotificationMessage } from '../../messages'
import type { TestStep } from '../TestStep'

export const thereIsANotification =
  (testStep: TestStep, notification: string) =>
  (_: ClientGameSystem, adapters: FakeClientGameAdapters): Test =>
    it(thereIsANotificationMessage(testStep, notification), () =>
      expect(adapters.notificationInteractor.notifications).include(notification),
    )
