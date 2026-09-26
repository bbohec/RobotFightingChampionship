import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { EventKind } from '../../type/EventKind'
import { checkCollisionGameEvent } from '../checkCollision/checkCollision'
import { newLoopEvent } from './newLoop'

feature(EventKind.create, () => {
    serverScenario(`${EventKind.newLoop} 1`, newLoopEvent,
        [], [
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [checkCollisionGameEvent()])
        ],
        [EntityIds.playerAMainMenu])
})
