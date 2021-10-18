
import { hideEvent } from './hide'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, feature, featureEventDescription, serverScenario, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { mainMenuPosition, Physical } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
feature(featureEventDescription(Action.hide), () => {
    clientScenario(`${Action.hide} 1`, hideEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA), EntityId.playerA,
        (game, adapters) => () => {
            adapters.drawingInteractor.drawEntity(new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu))
            new EntityBuilder(adapters.entityInteractor).buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        },
        [
            (game, adapters) => entityIsVisible(TestStep.Given, adapters, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu)),
            (game, adapters) => whenEventOccurs(game, hideEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA)),
            (game, adapters) => entityIsNotVisible(TestStep.Then, adapters, new Physical(EntityId.mainMenu, mainMenuPosition, ShapeType.mainMenu))
        ]
    )
    serverScenario(`${Action.hide} 2`, hideEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA),
        (game, adapters) => () => {

        },
        [
            (game, adapters) => whenEventOccurs(game, hideEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA))
        ]
    )
})
