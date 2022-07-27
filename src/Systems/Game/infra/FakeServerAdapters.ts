import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { InMemoryEventBus } from '../../../infra/event/InMemoryEventBus'
import { InMemoryClientEventInteractor } from '../../../EventInteractor/infra/client/InMemoryClientEventInteractor'
import { InMemoryServerEventInteractor } from '../../../EventInteractor/infra/server/InMemoryServerEventInteractor'
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
