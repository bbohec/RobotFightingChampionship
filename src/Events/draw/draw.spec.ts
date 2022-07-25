import { mainMenuPosition, makePhysical } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, eventsAreSent, feature, serverScenario, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { drawEvent } from './draw'

feature(Action.draw, () => {
    serverScenario(`${Action.draw} 1`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
        [EntityIds.playerA], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, EntityIds.playerA, [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))])
        ])
    clientScenario(`${Action.draw} 2`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)), EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => entityIsNotVisible(TestStep.Given, adapters, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            ...whenEventOccured(),
            (game, adapters) => entityIsVisible(TestStep.Then, adapters, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))
        ])
    clientScenario(`${Action.draw} 3`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)), EntityIds.playerA,
        (game, adapters) => () => {
            new EntityBuilder(adapters.entityInteractor)
                .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
                .buildEntity(EntityIds.playerAMainMenu).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            adapters.drawingInteractor.refreshEntity(adapters.entityInteractor.retrievePhysical(EntityIds.playerAMainMenu))
        },
        [
            (game, adapters) => entityIsVisible(TestStep.Given, adapters, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            ...whenEventOccured(),
            (game, adapters) => entityIsNotVisible(TestStep.Then, adapters, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false))
        ]
    )
    serverScenario(`${Action.draw} 4`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
        [EntityIds.playerA], (game, adapters) => () => {

        },
        [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, EntityIds.playerA, [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false))])
        ]
    )
})
