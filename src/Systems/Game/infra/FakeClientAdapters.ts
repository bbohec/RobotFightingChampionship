import { InMemoryEntityRepository } from '../../../Entities/GenericEntity/infra/InMemoryEntityRepository'
import { InMemoryDrawingAdapter } from '../../Drawing/infra/InMemoryDrawingAdapter'
import { InMemoryEventRepository } from '../../GameEventDispatcher/infra/InMemoryEventRepository'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { clientAdapters } from '../port/clientAdapters'

export class FakeClientAdapters implements clientAdapters {
    constructor (nextIdentifiers?:string[]) {
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
    }

    drawingInteractor= new InMemoryDrawingAdapter();
    identifierInteractor: IdentifierAdapter
    eventInteractor = new InMemoryEventRepository();
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
