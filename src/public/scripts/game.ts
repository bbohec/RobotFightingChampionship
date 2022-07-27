import { WebClientEventInteractor } from '../../infra/eventInteractor/client/WebClientEventInteractor'
import { serverFullyQualifiedDomainName } from '../../infra/eventInteractor/test'
import { PixijsDrawingAdapter } from '../../Systems/Drawing/infra/PixijsDrawingAdapter'
import { v1 as uuid } from 'uuid'
import { ProductionClientAdapters } from '../../Systems/Game/infra/ProductionClientAdapters'
import { ClientGameSystem } from '../../Systems/Game/ClientGame'
import { defaultHTTPWebServerPort } from '../../infra/eventInteractor/server/WebServerEventInteractor'
import { ProductionEventBus } from '../../infra/eventBus/ProductionEventBus'
import { shapeAssets } from './shapeAssets'
import { createPlayerEvent } from '../../Events/create/create'
import { ConsoleLogger } from '../../infra/logger/consoleLogger'
import { PixijsControllerAdapter } from '../../Systems/Controller/infra/PixijsControllerAdapter'
import { Application } from '@pixi/app'
const loadClient = (playerId:string) => {
    const productionClientEventBus = new ProductionEventBus(new ConsoleLogger('eventBus'))
    const pixiApplication = new Application()
    const controllerAdapter = new PixijsControllerAdapter(productionClientEventBus, pixiApplication, new ConsoleLogger('controllerAdapter'))
    const productionClientDrawingAdapter = new PixijsDrawingAdapter(shapeAssets, new ConsoleLogger('drawingAdapter'), pixiApplication)
    const productionClientEventInteractor = new WebClientEventInteractor(serverFullyQualifiedDomainName, defaultHTTPWebServerPort, playerId, productionClientEventBus, new ConsoleLogger('eventInteractor'))
    const resizePixiCanvas = () => productionClientDrawingAdapter.changeResolution({ x: window.innerWidth, y: window.innerHeight })
    window.addEventListener('resize', resizePixiCanvas)
    productionClientDrawingAdapter.addingViewToDom(document.body)
    resizePixiCanvas()
    productionClientEventBus.setGameSystem(new ClientGameSystem(new ProductionClientAdapters(productionClientDrawingAdapter, productionClientEventInteractor, playerId, controllerAdapter)))
    return productionClientEventInteractor
}
const playerId = uuid()
const eventInteractor = loadClient(playerId)
eventInteractor.start()
    .then(() => eventInteractor.sendEventToClient(createPlayerEvent))
    .catch(error => { throw error })
