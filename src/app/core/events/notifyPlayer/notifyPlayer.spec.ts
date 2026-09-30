import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { clientScenario, serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsClientComponents, thereIsServerComponents } from '../../../test/unitTest/component'
import { eventsAreSent, whenEventOccured } from '../../../test/unitTest/event'
import { thereIsANotification } from '../../../test/unitTest/notification'
import { EntityType, makeEntityReference } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import {
  notEnoughActionPointNotificationMessage,
  notifyPlayerEvent,
  wrongPlayerNotificationMessage,
} from './notifyPlayer'

feature(EventKind.notifyPlayer, () => {
  serverScenario(
    `${EventKind.notifyPlayer} 1 - Server Side`,
    notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage),
    [EntityIds.playerA],
    [
      thereIsServerComponents(TestStep.Given, []),
      ...whenEventOccured(),
      thereIsServerComponents(TestStep.Then, []),
      eventsAreSent(TestStep.Then, EntityIds.playerA, [
        notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage),
      ]),
    ],
  )
  clientScenario(
    `${EventKind.notifyPlayer} 2 - Client Side`,
    notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage),
    EntityIds.playerA,
    [
      thereIsClientComponents(TestStep.Given, [
        makeEntityReference(EntityIds.playerA, EntityType.player),
      ]),
      ...whenEventOccured(),
      thereIsClientComponents(TestStep.Then, [
        makeEntityReference(EntityIds.playerA, EntityType.player),
      ]),
      thereIsANotification(TestStep.Then, notEnoughActionPointNotificationMessage),
    ],
    undefined,
  )
  clientScenario(
    `${EventKind.notifyPlayer} 3 - Client Side bad player`,
    notifyPlayerEvent(EntityIds.playerB, notEnoughActionPointNotificationMessage),
    EntityIds.playerA,
    [
      thereIsClientComponents(TestStep.Given, [
        makeEntityReference(EntityIds.playerA, EntityType.player),
      ]),
      ...whenEventOccured(),
      thereIsClientComponents(TestStep.Then, [
        makeEntityReference(EntityIds.playerA, EntityType.player),
      ]),
      thereIsANotification(
        TestStep.Then,
        wrongPlayerNotificationMessage(EntityIds.playerB, notEnoughActionPointNotificationMessage),
      ),
    ],
    undefined,
  )
})
