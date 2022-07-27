import { makeController } from '../../components/Controller'
import { makePhysical, position } from '../../components/Physical'
import { ControlStatus } from '../../components/ControlStatus'
import { ShapeType } from '../../type/ShapeType'
import { EntityBuilder } from '../../../Entities/entityBuilder'
import { Action } from '../../type/Action'
import { EntityIds } from '../../../test/entityIds'
import { TestStep } from '../../../test/TestStep'
import { feature } from '../../../test/feature'
import { clientScenario, serverScenario } from '../../../test/scenario'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { updatePointerState } from './updatePointerState'
feature(Action.updatePlayerPointerState, () => {
    clientScenario(`${Action.updatePlayerPointerState} 1 - forward to server`, updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Idle), EntityIds.playerA,
        (game, adapters) => () => {
        }, [
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Idle)])
        ])
    serverScenario(`${Action.updatePlayerPointerState} 2 - Update server pointer on client pointer update`, updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Active)
        , [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withPhysical(position(0, 0), ShapeType.pointer, true).withController(ControlStatus.Idle).save()
        , [
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
