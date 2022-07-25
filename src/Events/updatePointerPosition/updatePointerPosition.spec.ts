import { makePhysical, position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { clientScenario, eventsAreSent, feature, thereIsClientComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
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
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'client', [updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Active)])
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
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'client', [updatePointerState(EntityIds.playerAPointer, position(0, 0), ControlStatus.Active)])
        ])
})
