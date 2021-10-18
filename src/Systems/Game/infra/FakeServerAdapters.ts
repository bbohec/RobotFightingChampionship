import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { InMemoryEventBus } from '../../../Event/infra/InMemoryEventBus'
import { NewInMemoryServerEventInteractor } from '../../../EventInteractor/infra/NewInMemoryServerEventInteractor'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { serverAdapters } from '../port/serverAdapters'

export class FakeServerAdapters implements serverAdapters {
    constructor (nextIdentifiers?:string[]) {
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
    }

    identifierInteractor: IdentifierAdapter;
    eventInteractor:NewInMemoryServerEventInteractor =new NewInMemoryServerEventInteractor(new InMemoryEventBus())
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
