import { WebClientEventInteractor } from '../../EventInteractor/infra/WebClientEventInteractor'
import { serverFullyQualifiedDomainName } from '../../EventInteractor/port/testUtilities'
import { PixijsDrawingAdapter } from '../../Systems/Drawing/infra/PixijsDrawingAdapter'
import { v1 as uuid } from 'uuid'
import { ProductionClientAdapters } from '../../Systems/Game/infra/ProductionClientAdapters'
import { ClientGameSystem } from '../../Systems/Game/ClientGame'
import { defaultHTTPWebServerPort } from '../../EventInteractor/infra/WebServerEventInteractor'
import { ProductionEventBus } from '../../Event/infra/ProductionEventBus'
const loadClient = (playerId:string) => {
    const productionClientEventBus = new ProductionEventBus()
    const productionClientDrawingAdapter = new PixijsDrawingAdapter(productionClientEventBus)
    const productionClientEventInteractor = new WebClientEventInteractor(serverFullyQualifiedDomainName, defaultHTTPWebServerPort, playerId, productionClientEventBus)
    const resizePixiCanvas = () => productionClientDrawingAdapter.changeResolution({ x: window.innerWidth, y: window.innerHeight })
    window.addEventListener('resize', resizePixiCanvas)
    productionClientDrawingAdapter.addingViewToDom(document.body)
    resizePixiCanvas()
    productionClientEventInteractor.start()
    return new ClientGameSystem(new ProductionClientAdapters(productionClientDrawingAdapter, productionClientEventInteractor, playerId))
}
loadClient(uuid())
