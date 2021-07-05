import { FakeServerAdapters } from './Systems/Game/infra/FakeServerAdapters'
import { ServerGame } from './Systems/Game/ServerGame'
// eslint-disable-next-line no-new
new ServerGame(new FakeServerAdapters())
