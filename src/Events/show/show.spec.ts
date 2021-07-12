import { describe } from 'mocha'
import { showEvent } from './show'
import { createMainMenuEvent } from '../create/create'
import { Action } from '../../Event/Action'
import { gameEntityId, mainMenuEntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, featureEventDescription, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
describe(featureEventDescription(Action.show), () => {
    clientScenario(showEvent(EntityType.mainMenu, mainMenuEntityId), undefined,
        (game, adapters) => () => game.onGameEvent(createMainMenuEvent(gameEntityId, mainMenuEntityId)), [
            (game, adapters) => entityIsNotVisible(TestStep.Given, adapters, mainMenuEntityId),
            (game, adapters) => whenEventOccurs(game, showEvent(EntityType.mainMenu, mainMenuEntityId)),
            (game, adapters) => entityIsVisible(TestStep.Then, adapters, mainMenuEntityId)
        ])
})
