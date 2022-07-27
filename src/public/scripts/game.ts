import { v1 as uuid } from 'uuid'
import { Application } from '@pixi/app'
import { createPlayerEvent } from '../../app/core/events/create/create'
import { ClientGameSystem } from '../../app/core/ecs/systems/ClientGameSystem'
import { shapeAssets } from './shapeAssets'
import { PixijsControllerAdapter } from '../../app/infra/controller/PixijsControllerAdapter'
import { PixijsDrawingAdapter } from '../../app/infra/drawing/PixijsDrawingAdapter'
import { ProductionEventBus } from '../../app/infra/eventBus/ProductionEventBus'
import { WebClientEventInteractor } from '../../app/infra/eventInteractor/client/WebClientEventInteractor'
import { defaultHTTPWebServerPort } from '../../app/infra/eventInteractor/server/WebServerEventInteractor'
import { serverFullyQualifiedDomainName } from '../../app/infra/eventInteractor/test'
import { ProductionClientGameAdapters } from '../../app/infra/game/client/ProductionClientGameAdapters'
import { ConsoleLogger } from '../../app/infra/logger/consoleLogger'
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
    productionClientEventBus.setGameSystem(new ClientGameSystem(new ProductionClientGameAdapters(productionClientDrawingAdapter, productionClientEventInteractor, playerId, controllerAdapter)))
    return productionClientEventInteractor
}
const playerId = uuid()
const eventInteractor = loadClient(playerId)
eventInteractor.start()
    .then(() => eventInteractor.sendEventToClient(createPlayerEvent))
    .catch(error => { throw error })
