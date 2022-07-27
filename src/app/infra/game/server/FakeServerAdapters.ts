import { ServerGameAdapters } from '../../../core/port/Game'
import { Identifier } from '../../../core/port/Identifier'
import { InMemoryEntityRepository } from '../../entity/InMemoryEntityRepository'
import { InMemoryEventBus } from '../../eventBus/InMemoryEventBus'
import { InMemoryClientEventInteractor } from '../../eventInteractor/client/InMemoryClientEventInteractor'
import { InMemoryServerEventInteractor } from '../../eventInteractor/server/InMemoryServerEventInteractor'
import { FakeIdentifierAdapter } from '../../identifier/FakeIdentifierAdapter'
import { InMemorySystemRepository } from '../../system/InMemorySystemInteractor'

export class FakeServerAdapters implements ServerGameAdapters {
    constructor (clientIds:string[], nextIdentifiers?:string[]) {
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
        this.eventInteractor = new InMemoryServerEventInteractor(new InMemoryEventBus(), clientIds.map(clientId => new InMemoryClientEventInteractor(clientId, new InMemoryEventBus())))
    }

    identifierInteractor: Identifier;
    eventInteractor :InMemoryServerEventInteractor
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
