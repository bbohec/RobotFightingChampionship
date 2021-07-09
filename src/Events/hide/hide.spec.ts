import { describe } from 'mocha'
import { showEvent } from '../show/show'
import { hideEvent } from './hide'
import { Action } from '../port/Action'
import { mainMenuEntityId } from '../port/entityIds'
import { EntityType } from '../port/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, featureEventDescription, whenEventOccurs } from '../port/test'
import { TestStep } from '../port/TestStep'
describe(featureEventDescription(Action.hide), () => {
    clientScenario(hideEvent(EntityType.mainMenu, mainMenuEntityId), [],
        (game) => () => game.onGameEvent(showEvent(EntityType.mainMenu, mainMenuEntityId)),
        [
            (game, adapters) => entityIsVisible(TestStep.Given, adapters, mainMenuEntityId),
            (game, adapters) => whenEventOccurs(game, hideEvent(EntityType.mainMenu, mainMenuEntityId)),
            (game, adapters) => entityIsNotVisible(TestStep.Then, adapters, mainMenuEntityId)
        ]
    )
})
