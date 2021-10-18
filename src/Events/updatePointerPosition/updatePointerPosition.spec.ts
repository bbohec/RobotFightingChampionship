import { Physical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { feature, featureEventDescription, clientScenario, whenEventOccurs, theEventIsSent, theEntityWithIdHasTheExpectedComponent, theEventIsNotSent } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { updatePointerPosition } from './updatePointerPosition'
import { updatePointerState } from '../updatePointerState/updatePointerState'
feature(featureEventDescription(Action.updatePlayerPointerPosition), () => {
    clientScenario(`${Action.updatePlayerPointerPosition} 1 - Update client pointer on new position`, updatePointerPosition(EntityId.playerAPointer, position(1, 1)), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withPhysicalComponent(position(0, 0), ShapeType.pointer).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer)),
            (game, adapters) => whenEventOccurs(game, updatePointerPosition(EntityId.playerAPointer, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(1, 1), ShapeType.pointer)),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, 'client', updatePointerState(EntityId.playerAPointer, position(1, 1)))
        ])
    clientScenario(`${Action.updatePlayerPointerPosition} 2 - Don't update client pointer on same position`, updatePointerState(EntityId.playerA, position(0, 0)), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withPhysicalComponent(position(0, 0), ShapeType.pointer).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer)),
            (game, adapters) => whenEventOccurs(game, updatePointerPosition(EntityId.playerAPointer, position(0, 0))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer)),
            (game, adapters) => theEventIsNotSent(TestStep.Then, adapters, 'server', updatePointerState(EntityId.playerA, position(0, 0)))
        ])
})
