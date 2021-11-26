import { Physical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { feature, featureEventDescription, clientScenario, eventsAreSent, theEntityWithIdHasTheExpectedComponent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { updatePointerPosition } from './updatePointerPosition'
import { updatePointerState } from '../updatePointerState/updatePointerState'
import { ControlStatus } from '../../Components/port/ControlStatus'
feature(featureEventDescription(Action.updatePlayerPointerPosition), () => {
    clientScenario(`${Action.updatePlayerPointerPosition} 1 - Update client pointer on new position`, updatePointerPosition(EntityId.playerAPointer, position(1, 1)), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withPhysicalComponent(position(0, 0), ShapeType.pointer, true).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(1, 1), ShapeType.pointer, true)),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'client', [updatePointerState(EntityId.playerAPointer, position(1, 1), ControlStatus.Active)])
        ])
    clientScenario(`${Action.updatePlayerPointerPosition} 2 - Don't update client pointer on same position`, updatePointerPosition(EntityId.playerAPointer, position(0, 0)), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withPhysicalComponent(position(0, 0), ShapeType.pointer, true).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer, true)),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [])
        ])
})
