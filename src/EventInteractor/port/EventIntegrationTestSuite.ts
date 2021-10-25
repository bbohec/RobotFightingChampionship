import { ClientEventInteractor, ServerEventInteractor } from './EventInteractor'

export interface EventIntegrationTestSuite {
    adapterType: string;
    serverEventInteractor: ServerEventInteractor;
    clientEventInteractor: ClientEventInteractor;
}
