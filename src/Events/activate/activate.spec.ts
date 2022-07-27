import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { TestStep } from '../../Event/TestStep'
import { feature } from '../../test/feature'
import { clientScenario } from '../../test/scenario'
import { theControllerAdapterIsNotInteractive, theControllerAdapterIsInteractive } from '../../test/unitTest/controller'
import { whenEventOccured } from '../../test/unitTest/event'
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
