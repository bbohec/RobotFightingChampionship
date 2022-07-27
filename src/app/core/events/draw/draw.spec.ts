import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario, clientScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { entityIsNotVisible, entityIsVisible } from '../../../test/unitTest/visible'
import { makePhysical, mainMenuPosition } from '../../ecs/components/Physical'
import { EntityBuilder } from '../../ecs/entity/entityBuilder'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { drawEvent } from './draw'

feature(Action.draw, () => {
    serverScenario(`${Action.draw} 1`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
        [EntityIds.playerA], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, EntityIds.playerA, [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))])
        ])
    clientScenario(`${Action.draw} 2`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)), EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
        , [
            entityIsNotVisible(TestStep.Given, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            ...whenEventOccured(),
            entityIsVisible(TestStep.Then, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))
        ])
    clientScenario(`${Action.draw} 3`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)), EntityIds.playerA,
        (game, adapters) => () => {
            new EntityBuilder(adapters.entityInteractor)
                .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
                .buildEntity(EntityIds.playerAMainMenu).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            adapters.drawingInteractor.refreshEntity(adapters.entityInteractor.retrievePhysical(EntityIds.playerAMainMenu))
        },
        [
            entityIsVisible(TestStep.Given, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            ...whenEventOccured(),
            entityIsNotVisible(TestStep.Then, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false))
        ]
    )
    serverScenario(`${Action.draw} 4`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
        [EntityIds.playerA], (game, adapters) => () => {

        },
        [
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, EntityIds.playerA, [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false))])
        ]
    )
})
