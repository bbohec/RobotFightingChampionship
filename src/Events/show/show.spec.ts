
import { showEvent } from './show'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, entityIsNotVisible, entityIsVisible, feature, featureEventDescription, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { EntityId } from '../../Event/entityIds'
feature(featureEventDescription(Action.show), () => {
    clientScenario(`${Action.show} 1`, showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA), undefined, [
        (game, adapters) => entityIsNotVisible(TestStep.Given, adapters, EntityId.mainMenu),
        (game, adapters) => whenEventOccurs(game, showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA)),
        (game, adapters) => entityIsVisible(TestStep.Then, adapters, EntityId.mainMenu)
    ])
})
