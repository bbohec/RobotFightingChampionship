import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { clientScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { theControllerAdapterIsNotInteractive, theControllerAdapterIsInteractive } from '../../../test/unitTest/controller'
import { whenEventOccured } from '../../../test/unitTest/event'
import { Action } from '../../type/Action'
import { activatePointerEvent } from './activate'

feature(Action.activate, () => {
    clientScenario(`${Action.activate} 1`, activatePointerEvent(EntityIds.playerAPointer), EntityIds.playerA,
        [
            theControllerAdapterIsNotInteractive(TestStep.Given),
            ...whenEventOccured(),
            theControllerAdapterIsInteractive(TestStep.Then)
        ])
})
