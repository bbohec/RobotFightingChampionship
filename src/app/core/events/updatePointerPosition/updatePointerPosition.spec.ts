import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { clientScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsClientComponents } from '../../../test/unitTest/component'
import { eventsAreSent, whenEventOccured } from '../../../test/unitTest/event'
import { ControlStatus } from '../../ecs/components/Controller'
import { makePhysical, position } from '../../ecs/components/Physical'
import { EventKind } from '../../type/EventKind'
import { ShapeType } from '../../type/ShapeType'
import { updatePointerState } from '../updatePointerState/updatePointerState'
import { updatePointerPosition } from './updatePointerPosition'

feature(EventKind.updatePlayerPointerPosition, () => {
  clientScenario(
    `${EventKind.updatePlayerPointerPosition} 1 - Update client pointer on new position`,
    updatePointerPosition(EntityIds.playerAPointer, position(1, 1)),
    EntityIds.playerA,
    [
      thereIsClientComponents(TestStep.Given, [
        makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true),
      ]),
      ...whenEventOccured(),
      thereIsClientComponents(TestStep.Then, [
        makePhysical(EntityIds.playerAPointer, position(1, 1), ShapeType.pointer, true),
      ]),
      eventsAreSent(TestStep.Then, 'client', [
        updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Active),
      ]),
    ],
  )
  clientScenario(
    `${EventKind.updatePlayerPointerPosition} 2 - Allow update client pointer on same position`,
    updatePointerPosition(EntityIds.playerAPointer, position(0, 0)),
    EntityIds.playerA,
    [
      thereIsClientComponents(TestStep.Given, [
        makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true),
      ]),
      ...whenEventOccured(),
      thereIsClientComponents(TestStep.Given, [
        makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true),
      ]),
      eventsAreSent(TestStep.Then, 'client', [
        updatePointerState(EntityIds.playerAPointer, position(0, 0), ControlStatus.Active),
      ]),
    ],
  )
})
