import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../core/type/Action'
import { EntityIds } from '../../test/entityIds'
import { EntityType } from '../../core/type/EntityType'
import { TestStep } from '../../test/TestStep'
import { feature } from '../../test/feature'
import { serverScenario, clientScenario } from '../../test/scenario'
import { whenEventOccured, eventsAreSent } from '../../test/unitTest/event'
import { thereIsANotification } from '../../test/unitTest/notification'
import { notEnoughActionPointNotificationMessage, notifyPlayerEvent, wrongPlayerNotificationMessage } from './notifyPlayer'

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
