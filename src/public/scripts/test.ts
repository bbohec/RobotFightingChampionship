import { Application } from 'pixi.js'
import { EntityIds } from '../../test/entityIds'
import { InMemoryEventBus } from '../../infra/eventBus/InMemoryEventBus'
import { ConsoleLogger } from '../../infra/logger/consoleLogger'
import { PixijsControllerAdapter } from '../../infra/controller/PixijsControllerAdapter'
import { PixijsDrawingAdapter } from '../../infra/drawing/PixijsDrawingAdapter'
import { shapeAssets } from './shapeAssets'
import { drawFixedEntities, drawMovingEntityPhysicals, drawWalls, runInterval } from './utils'

const inMemoryEventBus = new InMemoryEventBus()
const drawingAdapterLogger = new ConsoleLogger('drawingAdapter')
const eventBusLogger = new ConsoleLogger('eventBus')
const controllerLogger = new ConsoleLogger('controllerAdapter')
const pixiApp = new Application({ width: window.innerWidth, height: window.innerHeight })
const pixijsControllerAdapter = new PixijsControllerAdapter(inMemoryEventBus, pixiApp, controllerLogger)
const pixijsDrawingAdapter = new PixijsDrawingAdapter(shapeAssets, drawingAdapterLogger, pixiApp)
const resizePixiCanvas = () => pixijsDrawingAdapter.changeResolution({ x: window.innerWidth, y: window.innerHeight })
window.addEventListener('resize', resizePixiCanvas)
pixijsDrawingAdapter.addingViewToDom(document.body)
resizePixiCanvas()

const waitingIntervalSeconds = 0.03
const waitingTimeSeconds = 3

Promise.all([
    drawFixedEntities(pixijsDrawingAdapter),
    drawWalls(pixijsDrawingAdapter)
])
    .then(() => {
        drawingAdapterLogger.info(pixijsDrawingAdapter.absolutePositionByEntityId(EntityIds.playerBRobot))
        drawingAdapterLogger.info(pixijsDrawingAdapter.retrieveResolution())
        drawingAdapterLogger.info(pixijsDrawingAdapter.retrieveDrawnEntities().get(EntityIds.playerBRobot))
        // return setTimeout(() => pixijsAdapter.eraseAll(), waitingTimeSeconds * 1000)
    })
    .catch(error => { throw error })

const interval:NodeJS.Timeout = setTimeout(() => runInterval(pixijsDrawingAdapter, interval, drawMovingEntityPhysicals(10, 80), waitingIntervalSeconds), waitingTimeSeconds * 1000)

setTimeout(() => pixijsControllerAdapter.activate(EntityIds.playerAPointer), waitingTimeSeconds * 1000)
setTimeout(() => eventBusLogger.info(inMemoryEventBus.events), waitingTimeSeconds * 1000 * 3)
