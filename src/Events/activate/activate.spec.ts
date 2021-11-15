import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { clientScenario, feature, featureEventDescription, theControllerAdapterIsInteractive, theControllerAdapterIsNotInteractive, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { activatePointerEvent } from './activate'

feature(featureEventDescription(Action.activate), () => {
    clientScenario(`${Action.activate} 1`, activatePointerEvent(EntityId.playerAPointer), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            (game, adapters) => theControllerAdapterIsNotInteractive(TestStep.Given, adapters),
            (game, adapters) => whenEventOccurs(game, activatePointerEvent(EntityId.playerAPointer)),
            (game, adapters) => theControllerAdapterIsInteractive(TestStep.Then, adapters)
        ]
    )
})
