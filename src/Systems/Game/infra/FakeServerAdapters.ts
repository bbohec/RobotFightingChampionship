import { InMemoryEntityRepository } from '../../../Entities/GenericEntity/infra/InMemoryEntityRepository'
import { InMemoryEventRepository } from '../../GameEventDispatcher/infra/InMemoryEventRepository'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { serverAdapters } from '../port/serverAdapters'

export class FakeServerAdapters implements serverAdapters {
    constructor (nextIdentifiers?:string[]) {
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
    }

    identifierInteractor: IdentifierAdapter;
    eventInteractor = new InMemoryEventRepository();
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
