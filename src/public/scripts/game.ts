import { InMemoryEventBus } from '../../Event/infra/InMemoryEventBus'
import { WebClientEventInteractor } from '../../EventInteractor/infra/WebClientEventInteractor'
import { serverFullyQualifiedDomainName } from '../../EventInteractor/port/testUtilities'
import { PixijsDrawingAdapter } from '../../Systems/Drawing/infra/PixijsDrawingAdapter'
import { v1 as uuid } from 'uuid'
import { ProductionClientAdapters } from '../../Systems/Game/infra/ProductionClientAdapters'
import { ClientGameSystem } from '../../Systems/Game/ClientGame'
import { defaultHTTPWebServerPort } from '../../EventInteractor/infra/WebServerEventInteractor'
const loadClient = (playerId:string) => {
    const productionClientEventBus = new InMemoryEventBus()
    const productionClientDrawingAdapter = new PixijsDrawingAdapter(productionClientEventBus)
    const productionClientEventInteractor = new WebClientEventInteractor(serverFullyQualifiedDomainName, defaultHTTPWebServerPort, playerId, productionClientEventBus)
    const productionClientAdapters = new ProductionClientAdapters(productionClientDrawingAdapter, productionClientEventInteractor)
    const resizePixiCanvas = () => productionClientDrawingAdapter.changeResolution({ x: window.innerWidth, y: window.innerHeight })
    window.addEventListener('resize', resizePixiCanvas)
    productionClientDrawingAdapter.addingViewToDom(document.body)
    resizePixiCanvas()
    return new ClientGameSystem(productionClientAdapters)
}
loadClient(uuid())
