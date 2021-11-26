import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { clientScenario, feature, featureEventDescription, theControllerAdapterIsInteractive, theControllerAdapterIsNotInteractive, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { activatePointerEvent } from './activate'

feature(featureEventDescription(Action.activate), () => {
    clientScenario(`${Action.activate} 1`, activatePointerEvent(EntityId.playerAPointer), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            (game, adapters) => theControllerAdapterIsNotInteractive(TestStep.Given, adapters),
            ...whenEventOccured(),
            (game, adapters) => theControllerAdapterIsInteractive(TestStep.Then, adapters)
        ]
    )
})
