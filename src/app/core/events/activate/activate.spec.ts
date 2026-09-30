import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { clientScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import {
  theControllerAdapterIsInteractive,
  theControllerAdapterIsNotInteractive,
} from '../../../test/unitTest/controller'
import { whenEventOccured } from '../../../test/unitTest/event'
import { EventKind } from '../../type/EventKind'
import { activatePointerEvent } from './activate'

feature(EventKind.activate, () => {
  clientScenario(
    `${EventKind.activate} 1`,
    activatePointerEvent(EntityIds.playerAPointer),
    EntityIds.playerA,
    [
      theControllerAdapterIsNotInteractive(TestStep.Given),
      ...whenEventOccured(),
      theControllerAdapterIsInteractive(TestStep.Then),
    ],
  )
})
