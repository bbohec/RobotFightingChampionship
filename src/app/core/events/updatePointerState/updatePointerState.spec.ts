import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { clientScenario, serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeController } from '../../ecs/components/Controller'
import { ControlStatus } from '../../type/ControlStatus'
import { position, makePhysical } from '../../ecs/components/Physical'
import { Action } from '../../type/Action'
import { ShapeType } from '../../type/ShapeType'
import { updatePointerState } from './updatePointerState'

feature(Action.updatePlayerPointerState, () => {
    clientScenario(`${Action.updatePlayerPointerState} 1 - forward to server`, updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Idle), EntityIds.playerA,
        [
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Idle)])
        ])
    serverScenario(`${Action.updatePlayerPointerState} 2 - Update server pointer on client pointer update`, updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Active),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle)

            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhysical(EntityIds.playerAPointer, position(1, 1), ShapeType.pointer, true),
                makeController(EntityIds.playerAPointer, ControlStatus.Active)
            ])
        ])
})
