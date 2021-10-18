import { IntegrationEventInteractor } from './IntegrationEventInteractor'

export interface EventIntegrationTestSuite {
    adapterType: string;
    serverEventInteractor: IntegrationEventInteractor;
    clientEventInteractor: IntegrationEventInteractor;
}
