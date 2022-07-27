import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { EntityBuilder } from '../../ecs/entity/entityBuilder'
import { Action } from '../../type/Action'
import { checkCollisionGameEvent } from '../checkCollision/checkCollision'
import { newLoopEvent } from './newLoop'

feature(Action.create, () => {
    serverScenario(`${Action.newLoop} 1`, newLoopEvent,
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [checkCollisionGameEvent()])
        ],
        [EntityIds.playerAMainMenu])
})
