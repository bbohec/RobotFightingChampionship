import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario, clientScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsClientComponents, thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { thereIsANotification } from '../../../test/unitTest/notification'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { notifyPlayerEvent, notEnoughActionPointNotificationMessage, wrongPlayerNotificationMessage } from './notifyPlayer'

feature(Action.notifyPlayer, () => {
    serverScenario(`${Action.notifyPlayer} 1 - Server Side`, notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage),
        [EntityIds.playerA]
        , [
            thereIsServerComponents(TestStep.Given, []),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, []),
            eventsAreSent(TestStep.Then, EntityIds.playerA, [notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage)])
        ])
    clientScenario(`${Action.notifyPlayer} 2 - Client Side`, notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage), EntityIds.playerA,
        [
            thereIsClientComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            thereIsANotification(TestStep.Then, notEnoughActionPointNotificationMessage)
        ], undefined)
    clientScenario(`${Action.notifyPlayer} 3 - Client Side bad player`, notifyPlayerEvent(EntityIds.playerB, notEnoughActionPointNotificationMessage), EntityIds.playerA,
        [
            thereIsClientComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            thereIsANotification(TestStep.Then, wrongPlayerNotificationMessage(EntityIds.playerB, notEnoughActionPointNotificationMessage))
        ], undefined)
})
