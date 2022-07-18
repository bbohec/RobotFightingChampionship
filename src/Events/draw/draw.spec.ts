import { mainMenuPosition, makePhysical, Physical } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, eventsAreSent, feature, featureEventDescription, serverScenario, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { drawEvent } from './draw'

feature(featureEventDescription(Action.draw), () => {
    serverScenario(`${Action.draw} 1`, drawEvent(EntityId.playerA, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'client', [drawEvent(EntityId.playerA, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))])
        ])
    clientScenario(`${Action.draw} 2`, drawEvent(EntityId.playerA, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => entityIsNotVisible(TestStep.Given, adapters, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            ...whenEventOccured(),
            (game, adapters) => entityIsVisible(TestStep.Then, adapters, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))
        ])
    clientScenario(`${Action.draw} 3`, drawEvent(EntityId.playerA, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)), EntityId.playerA,
        (game, adapters) => () => {
            new EntityBuilder(adapters.entityInteractor)
                .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
                .buildEntity(EntityId.playerAMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            adapters.drawingInteractor.refreshEntity(adapters.entityInteractor.retrieveyComponentByEntityId<Physical>(EntityId.playerAMainMenu))
        },
        [
            (game, adapters) => entityIsVisible(TestStep.Given, adapters, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            ...whenEventOccured(),
            (game, adapters) => entityIsNotVisible(TestStep.Then, adapters, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false))
        ]
    )
    serverScenario(`${Action.draw} 4`, drawEvent(EntityId.playerA, makePhysical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
        (game, adapters) => () => {

        },
        [
            ...whenEventOccured()
        ]
    )
})
