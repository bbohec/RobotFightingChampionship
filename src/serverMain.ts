import { FakeServerAdapters } from './Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from './Systems/Game/ServerGame'
// eslint-disable-next-line no-new
new ServerGameSystem(new FakeServerAdapters())
