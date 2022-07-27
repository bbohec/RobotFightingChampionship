import { EntityIds } from '../../../../test/entityIds'
import { feature } from '../../../../test/feature'
import { serverScenario, clientScenario } from '../../../../test/scenario'
import { TestStep } from '../../../../test/TestStep'
import { whenEventOccured, eventsAreSent } from '../../../../test/unitTest/event'
import { thereIsANotification } from '../../../../test/unitTest/notification'
import { EntityBuilder } from '../../entity/entityBuilder'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { notifyPlayerEvent, notEnoughActionPointNotificationMessage, wrongPlayerNotificationMessage } from './notifyPlayer'

feature(Action.notifyPlayer, () => {
    serverScenario(`${Action.notifyPlayer} 1 - Server Side`, notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage),
        [EntityIds.playerA], undefined
        , [
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, EntityIds.playerA, [notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage)])
        ])
    clientScenario(`${Action.notifyPlayer} 2 - Client Side`, notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage), EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => thereIsANotification(TestStep.Then, adapters, notEnoughActionPointNotificationMessage)
        ], undefined)
    clientScenario(`${Action.notifyPlayer} 3 - Client Side bad player`, notifyPlayerEvent(EntityIds.playerB, notEnoughActionPointNotificationMessage), EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => thereIsANotification(TestStep.Then, adapters, wrongPlayerNotificationMessage(EntityIds.playerB, notEnoughActionPointNotificationMessage))
        ], undefined)
})
