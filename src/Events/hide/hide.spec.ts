
import { hideEvent } from './hide'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, feature, featureEventDescription, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
feature(featureEventDescription(Action.hide), () => {
    clientScenario(`${Action.hide} 1`, hideEvent(EntityType.mainMenu, EntityId.mainMenu),
        (game, adapters) => () => adapters.drawingInteractor.drawEntity(EntityId.mainMenu),
        [
            (game, adapters) => entityIsVisible(TestStep.Given, adapters, EntityId.mainMenu),
            (game, adapters) => whenEventOccurs(game, hideEvent(EntityType.mainMenu, EntityId.mainMenu)),
            (game, adapters) => entityIsNotVisible(TestStep.Then, adapters, EntityId.mainMenu)
        ]
    )
})
