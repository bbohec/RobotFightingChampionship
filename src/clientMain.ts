import { ClientGame } from './Systems/Game/ClientGame'
import { ProductionClientAdapters } from './Systems/Game/infra/ProductionClientAdapters'
// eslint-disable-next-line no-new
new ClientGame(new ProductionClientAdapters())
