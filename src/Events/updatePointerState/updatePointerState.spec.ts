import { makeController } from '../../Components/Controller'
import { makePhysical, position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { clientScenario, eventsAreSent, feature, featureEventDescription, serverScenario, thereIsServerComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { updatePointerState } from './updatePointerState'
feature(featureEventDescription(Action.updatePlayerPointerState), () => {
    clientScenario(`${Action.updatePlayerPointerState} 1 - forward to server`, updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Idle), EntityIds.playerA,
        (game, adapters) => () => {
        }, [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [updatePointerState(EntityIds.playerAPointer, position(1, 1), ControlStatus.Idle)])
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
