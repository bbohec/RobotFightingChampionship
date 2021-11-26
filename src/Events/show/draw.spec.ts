import { mainMenuPosition, Physical } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, clientScenario, entityIsVisible, entityIsNotVisible, serverScenario, eventsAreSent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { drawEvent } from './draw'

feature(featureEventDescription(Action.draw), () => {
    serverScenario(`${Action.draw} 1`, drawEvent(EntityType.mainMenu, EntityId.playerAMainMenu, EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'client', [drawEvent(EntityType.mainMenu, EntityId.playerAMainMenu, EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))])
        ])
    clientScenario(`${Action.draw} 2`, drawEvent(EntityType.mainMenu, EntityId.playerAMainMenu, EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)), EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => entityIsNotVisible(TestStep.Given, adapters, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            ...whenEventOccured(),
            (game, adapters) => entityIsVisible(TestStep.Then, adapters, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))
        ])
    clientScenario(`${Action.draw} 3`, drawEvent(EntityType.mainMenu, EntityId.playerAMainMenu, EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)), EntityId.playerA,
        (game, adapters) => () => {
            new EntityBuilder(adapters.entityInteractor)
                .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
                .buildEntity(EntityId.playerAMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            adapters.drawingInteractor.refreshEntity(adapters.entityInteractor.retrieveEntityComponentByEntityId(EntityId.playerAMainMenu, Physical))
        },
        [
            (game, adapters) => entityIsVisible(TestStep.Given, adapters, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            ...whenEventOccured(),
            (game, adapters) => entityIsNotVisible(TestStep.Then, adapters, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false))
        ]
    )
    serverScenario(`${Action.draw} 4`, drawEvent(EntityType.mainMenu, EntityId.playerAMainMenu, EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
        (game, adapters) => () => {

        },
        [
            ...whenEventOccured()
        ]
    )
})
