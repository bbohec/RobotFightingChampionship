
import { Action } from '../../Event/Action'
import { eventsAreSent, featureEventDescription, serverScenario, feature, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
import { newLoopEvent } from './newLoop'
import { checkCollisionGameEvent } from '../checkCollision/checkCollision'

feature(featureEventDescription(Action.create), () => {
    serverScenario(`${Action.newLoop} 1`, newLoopEvent,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [checkCollisionGameEvent()])
        ],
        [EntityId.playerAMainMenu])
})
