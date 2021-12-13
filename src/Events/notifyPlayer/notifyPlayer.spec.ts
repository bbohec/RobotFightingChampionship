import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, feature, featureEventDescription, serverScenario, theEntityIsOnRepository, eventsAreSent, thereIsANotification, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { notEnoughActionPointNotificationMessage, notifyPlayerEvent, wrongPlayerNotificationMessage } from './notifyPlayer'

feature(featureEventDescription(Action.notifyPlayer), () => {
    serverScenario(`${Action.notifyPlayer} 1 - Server Side`, notifyPlayerEvent(EntityId.playerA, notEnoughActionPointNotificationMessage), undefined
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'client', [notifyPlayerEvent(EntityId.playerA, notEnoughActionPointNotificationMessage)])
        ])
    clientScenario(`${Action.notifyPlayer} 2 - Client Side`, notifyPlayerEvent(EntityId.playerA, notEnoughActionPointNotificationMessage), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => thereIsANotification(TestStep.Then, adapters, notEnoughActionPointNotificationMessage)
        ], undefined)
    clientScenario(`${Action.notifyPlayer} 3 - Client Side bad player`, notifyPlayerEvent(EntityId.playerB, notEnoughActionPointNotificationMessage), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            ...whenEventOccured(),
            (game, adapters) => thereIsANotification(TestStep.Then, adapters, wrongPlayerNotificationMessage(EntityId.playerB, notEnoughActionPointNotificationMessage))
        ], undefined)
})
