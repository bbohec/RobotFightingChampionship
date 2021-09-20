import { describe } from 'mocha'
import { hideEvent } from './hide'
import { Action } from '../../Event/Action'
import { mainMenuEntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, featureEventDescription, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
describe(featureEventDescription(Action.hide), () => {
    clientScenario(`${Action.hide} 1`, hideEvent(EntityType.mainMenu, mainMenuEntityId),
        (game, adapters) => () => adapters.drawingInteractor.drawEntity(mainMenuEntityId),
        [
            (game, adapters) => entityIsVisible(TestStep.Given, adapters, mainMenuEntityId),
            (game, adapters) => whenEventOccurs(game, hideEvent(EntityType.mainMenu, mainMenuEntityId)),
            (game, adapters) => entityIsNotVisible(TestStep.Then, adapters, mainMenuEntityId)
        ]
    )
})
