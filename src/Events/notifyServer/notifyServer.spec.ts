import { Action } from '../../Event/Action'

import { feature, serverScenario, whenEventOccured } from '../../Event/test'

import { notifyServerEvent } from './notifyServer'

feature(Action.notifyServer, () => {
    serverScenario(`${Action.notifyServer}`, notifyServerEvent('test message'), [], undefined
        , [
            ...whenEventOccured()
        ])
})
