import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { clientScenario, feature, theControllerAdapterIsInteractive, theControllerAdapterIsNotInteractive, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { activatePointerEvent } from './activate'

feature(Action.activate, () => {
    clientScenario(`${Action.activate} 1`, activatePointerEvent(EntityIds.playerAPointer), EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            (game, adapters) => theControllerAdapterIsNotInteractive(TestStep.Given, adapters),
            ...whenEventOccured(),
            (game, adapters) => theControllerAdapterIsInteractive(TestStep.Then, adapters)
        ]
    )
})
