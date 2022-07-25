import { Action } from '../../Event/Action'

import { feature, featureEventDescription, serverScenario, whenEventOccured } from '../../Event/test'

import { notifyServerEvent } from './notifyServer'

feature(featureEventDescription(Action.notifyServer), () => {
    serverScenario(`${Action.notifyServer}`, notifyServerEvent('test message'), [], undefined
        , [
            ...whenEventOccured()
        ])
})
