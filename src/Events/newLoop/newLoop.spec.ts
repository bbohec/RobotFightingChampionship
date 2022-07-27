
import { Action } from '../../Event/Action'
import { TestStep } from '../../Event/TestStep'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityIds } from '../../Event/entityIds'
import { newLoopEvent } from './newLoop'
import { checkCollisionGameEvent } from '../checkCollision/checkCollision'
import { feature } from '../../test/feature'
import { serverScenario } from '../../test/scenario'
import { whenEventOccured, eventsAreSent } from '../../test/unitTest/event'

feature(Action.create, () => {
    serverScenario(`${Action.newLoop} 1`, newLoopEvent,
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [checkCollisionGameEvent()])
        ],
        [EntityIds.playerAMainMenu])
})
