
import { Action } from '../../Event/Action'
import { eventsAreSent, serverScenario, feature, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityIds } from '../../Event/entityIds'
import { newLoopEvent } from './newLoop'
import { checkCollisionGameEvent } from '../checkCollision/checkCollision'

feature(Action.create, () => {
    serverScenario(`${Action.newLoop} 1`, newLoopEvent,
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            (game, adapters) => eventsAreSent(TestStep.Then, adapters, 'server', [checkCollisionGameEvent()])
        ],
        [EntityIds.playerAMainMenu])
})
