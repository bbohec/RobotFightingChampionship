import { describe } from 'mocha'
import { showEvent } from './show'
import { Action } from '../../Event/Action'
import { mainMenuEntityId, playerAId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, featureEventDescription, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
describe(featureEventDescription(Action.show), () => {
    clientScenario(`${Action.show} 1`, showEvent(EntityType.mainMenu, mainMenuEntityId, playerAId), undefined, [
        (game, adapters) => entityIsNotVisible(TestStep.Given, adapters, mainMenuEntityId),
        (game, adapters) => whenEventOccurs(game, showEvent(EntityType.mainMenu, mainMenuEntityId, playerAId)),
        (game, adapters) => entityIsVisible(TestStep.Then, adapters, mainMenuEntityId)
    ])
})
