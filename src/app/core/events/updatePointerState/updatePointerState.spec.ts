import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { clientScenario, serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { eventsAreSent, whenEventOccured } from '../../../test/unitTest/event'
import { ControlStatus, makeController } from '../../ecs/components/Controller'
import { makePhysical, position } from '../../ecs/components/Physical'
import { EventKind } from '../../type/EventKind'
import { ShapeType } from '../../type/ShapeType'
import { updatePointerState } from './updatePointerState'

feature(EventKind.updatePlayerPointerState, () => {
  clientScenario(
    `${EventKind.updatePlayerPointerState} 1 - forward to server`,
    updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Idle),
    EntityIds.playerA,
    [
      ...whenEventOccured(),
      eventsAreSent(TestStep.Then, 'server', [
        updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Idle),
      ]),
    ],
  )
  serverScenario(
    `${EventKind.updatePlayerPointerState} 2 - Update server pointer on client pointer update`,
    updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Active),
    [],
    [
      thereIsServerComponents(TestStep.Given, [
        makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true),
        makeController(EntityIds.playerAPointer, ControlStatus.Idle),
      ]),
      ...whenEventOccured(),
      thereIsServerComponents(TestStep.Then, [
        makePhysical(EntityIds.playerAPointer, position(1, 1), ShapeType.pointer, true),
        makeController(EntityIds.playerAPointer, ControlStatus.Active),
      ]),
    ],
  )
})
