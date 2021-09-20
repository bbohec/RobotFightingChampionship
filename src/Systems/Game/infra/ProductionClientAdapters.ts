import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { PixijsDrawingAdapter } from '../../Drawing/infra/PixijsDrawingAdapter'
import { InMemoryEventRepository } from '../../GameEventDispatcher/infra/InMemoryEventRepository'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { clientAdapters } from '../port/clientAdapters'

export class ProductionClientAdapters implements clientAdapters {
    constructor (nextIdentifiers?:string[]) {
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
    }

    drawingInteractor= new PixijsDrawingAdapter()
    identifierInteractor: IdentifierAdapter
    eventInteractor = new InMemoryEventRepository();
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
