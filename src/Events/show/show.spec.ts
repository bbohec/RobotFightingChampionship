import { describe } from 'mocha'
import { showEvent } from './show'
import { createMainMenuEvent } from '../create/create'
import { Action } from '../port/Action'
import { gameEntityId, mainMenuEntityId } from '../port/entityIds'
import { EntityType } from '../port/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, featureEventDescription, whenEventOccurs } from '../port/test'
import { TestStep } from '../port/TestStep'
describe(featureEventDescription(Action.show), () => {
    clientScenario(showEvent(EntityType.mainMenu, mainMenuEntityId), undefined,
        (game, adapters) => () => game.onGameEvent(createMainMenuEvent(gameEntityId, mainMenuEntityId)), [
            (game, adapters) => entityIsNotVisible(TestStep.Given, adapters, mainMenuEntityId),
            (game, adapters) => whenEventOccurs(game, showEvent(EntityType.mainMenu, mainMenuEntityId)),
            (game, adapters) => entityIsVisible(TestStep.Then, adapters, mainMenuEntityId)
        ])
})
