
import { Action } from '../../Event/Action'
import { whenEventOccurs, theEventIsSent, featureEventDescription, serverScenario, feature } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
import { newLoopEvent } from './newLoop'
import { checkCollisionGameEvent } from '../checkCollision/checkCollision'

feature(featureEventDescription(Action.create), () => {
    serverScenario(`${Action.newLoop} 1`, newLoopEvent,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            (game, adapters) => whenEventOccurs(game, newLoopEvent),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, 'server', checkCollisionGameEvent())
        ],
        [EntityId.playerAMainMenu])
})
