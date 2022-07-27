import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { clientScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsClientComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { ControlStatus } from '../../components/ControlStatus'
import { position, makePhysical } from '../../components/Physical'
import { EntityBuilder } from '../../entity/entityBuilder'
import { Action } from '../../type/Action'
import { ShapeType } from '../../type/ShapeType'
import { updatePointerState } from '../updatePointerState/updatePointerState'
import { updatePointerPosition } from './updatePointerPosition'

feature(Action.updatePlayerPointerPosition, () => {
    clientScenario(`${Action.updatePlayerPointerPosition} 1 - Update client pointer on new position`, updatePointerPosition(EntityIds.playerAPointer, position(1, 1)), EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withPhysical(position(0, 0), ShapeType.pointer, true).save()
        , [
            thereIsClientComponents(TestStep.Given, [
                makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true)
            ]),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, [
                makePhysical(EntityIds.playerAPointer, position(1, 1), ShapeType.pointer, true)
            ]),
            eventsAreSent(TestStep.Then, 'client', [updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Active)])
        ])
    clientScenario(`${Action.updatePlayerPointerPosition} 2 - Allow update client pointer on same position`, updatePointerPosition(EntityIds.playerAPointer, position(0, 0)), EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerAPointer).withPhysical(position(0, 0), ShapeType.pointer, true).save()
        , [
            thereIsClientComponents(TestStep.Given, [
                makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true)
            ]),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Given, [
                makePhysical(EntityIds.playerAPointer, position(0, 0), ShapeType.pointer, true)
            ]),
            eventsAreSent(TestStep.Then, 'client', [updatePointerState(EntityIds.playerAPointer, position(0, 0), ControlStatus.Active)])
        ])
})
