import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, feature, featureEventDescription, serverScenario, theEntityIsOnRepository, theEventIsSent, thereIsANotification, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { notEnoughActionPointNotificationMessage, notifyEvent, wrongPlayerNotificationMessage } from './notify'

feature(featureEventDescription(Action.notify), () => {
    serverScenario(`${Action.notify} 1 - Server Side`, notifyEvent(EntityId.playerA, notEnoughActionPointNotificationMessage), undefined
        , [
            (game, adapters) => whenEventOccurs(game, notifyEvent(EntityId.playerA, notEnoughActionPointNotificationMessage)),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, 'client', notifyEvent(EntityId.playerA, notEnoughActionPointNotificationMessage))
        ])
    clientScenario(`${Action.notify} 2 - Client Side`, notifyEvent(EntityId.playerA, notEnoughActionPointNotificationMessage), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => whenEventOccurs(game, notifyEvent(EntityId.playerA, notEnoughActionPointNotificationMessage)),
            (game, adapters) => thereIsANotification(TestStep.Then, adapters, notEnoughActionPointNotificationMessage)
        ], undefined)
    clientScenario(`${Action.notify} 3 - Client Side bad player`, notifyEvent(EntityId.playerB, notEnoughActionPointNotificationMessage), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            (game, adapters) => whenEventOccurs(game, notifyEvent(EntityId.playerB, notEnoughActionPointNotificationMessage)),
            (game, adapters) => thereIsANotification(TestStep.Then, adapters, wrongPlayerNotificationMessage(EntityId.playerB, notEnoughActionPointNotificationMessage))
        ], undefined)
})
