import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, feature, serverScenario, theEntityIsOnRepository, eventsAreSent, thereIsANotification, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { notEnoughActionPointNotificationMessage, notifyPlayerEvent, wrongPlayerNotificationMessage } from './notifyPlayer'

feature(Action.notifyPlayer, () => {
    serverScenario(`${Action.notifyPlayer} 1 - Server Side`, notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage),
        [EntityIds.playerA], undefined
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, EntityIds.playerA, [notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage)])
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
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityIds.playerA),
            ...whenEventOccured(),
            (game, adapters) => thereIsANotification(TestStep.Then, adapters, wrongPlayerNotificationMessage(EntityIds.playerB, notEnoughActionPointNotificationMessage))
        ], undefined)
})
