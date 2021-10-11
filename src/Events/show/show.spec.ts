
import { showEvent } from './show'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, feature, featureEventDescription, serverScenario, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { EntityId } from '../../Event/entityIds'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { mainMenuPosition, Physical } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
feature(featureEventDescription(Action.show), () => {
    serverScenario(`${Action.show} 1`, showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu)), undefined, [
        (game, adapters) => whenEventOccurs(game, showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu))),
        (game, adapters) => theEventIsSent(TestStep.Then, adapters, 'client', showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu)))
    ])
    clientScenario(`${Action.show} 2`, showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => entityIsNotVisible(TestStep.Given, adapters, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu)),
            (game, adapters) => whenEventOccurs(game, showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu))),
            (game, adapters) => entityIsVisible(TestStep.Then, adapters, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu))
        ])
})
