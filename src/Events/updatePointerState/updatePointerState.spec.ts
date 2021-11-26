import { Controller } from '../../Components/Controller'
import { Physical, position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { feature, featureEventDescription, clientScenario, eventsAreSent, serverScenario, theEntityWithIdHasTheExpectedComponent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { updatePointerState } from './updatePointerState'
feature(featureEventDescription(Action.updatePlayerPointerState), () => {
    clientScenario(`${Action.updatePlayerPointerState} 1 - forward to server`, updatePointerState(EntityId.playerAPointer, position(1, 1), ControlStatus.Idle), EntityId.playerA,
        (game, adapters) => () => {
        }, [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [updatePointerState(EntityId.playerAPointer, position(1, 1), ControlStatus.Idle)])
        ])
    serverScenario(`${Action.updatePlayerPointerState} 2 - Update server pointer on client pointer update`, updatePointerState(EntityId.playerAPointer, position(1, 1), ControlStatus.Active),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withPhysicalComponent(position(0, 0), ShapeType.pointer, true).withController(ControlStatus.Idle).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Idle)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(1, 1), ShapeType.pointer, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Active))
        ])
})
