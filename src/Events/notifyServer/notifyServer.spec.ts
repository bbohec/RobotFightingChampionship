import { Action } from '../../Event/Action'
import { feature } from '../../test/feature'
import { serverScenario } from '../../test/scenario'
import { whenEventOccured } from '../../test/unitTest/event'
import { notifyServerEvent } from './notifyServer'

feature(Action.notifyServer, () => {
    serverScenario(`${Action.notifyServer}`, notifyServerEvent('test message'), [], undefined
        , [
            ...whenEventOccured()
        ])
})
