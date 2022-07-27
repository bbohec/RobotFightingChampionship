import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { InMemoryEventBus } from '../../../infra/eventBus/InMemoryEventBus'
import { InMemoryClientEventInteractor } from '../../../infra/eventInteractor/client/InMemoryClientEventInteractor'
import { InMemoryServerEventInteractor } from '../../../infra/eventInteractor/server/InMemoryServerEventInteractor'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { serverAdapters } from '../port/serverAdapters'

export class FakeServerAdapters implements serverAdapters {
    constructor (clientIds:string[], nextIdentifiers?:string[]) {
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
        this.eventInteractor = new InMemoryServerEventInteractor(new InMemoryEventBus(), clientIds.map(clientId => new InMemoryClientEventInteractor(clientId, new InMemoryEventBus())))
    }

    identifierInteractor: IdentifierAdapter;
    eventInteractor :InMemoryServerEventInteractor
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
