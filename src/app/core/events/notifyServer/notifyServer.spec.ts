import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { whenEventOccured } from '../../../test/unitTest/event'
import { EventKind } from '../../type/EventKind'
import { notifyServerEvent } from './notifyServer'

feature(EventKind.notifyServer, () => {
    serverScenario(`${EventKind.notifyServer}`, notifyServerEvent('test message'), []
        , [
            ...whenEventOccured()
        ])
})
