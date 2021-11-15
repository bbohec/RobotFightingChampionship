import { EntityId } from '../../Event/entityIds'
import { InMemoryEventBus } from '../../Event/infra/InMemoryEventBus'
import { ConsoleLogger } from '../../Log/infra/consoleLogger'
import { PixijsDrawingAdapter } from '../../Systems/Drawing/infra/PixijsDrawingAdapter'
import { shapeAssets } from './shapeAssets'
import { drawFixedEntities, drawMovingEntityPhysicals, drawWalls, runInterval } from './utils'

const inMemoryEventBus = new InMemoryEventBus()
const drawingAdapterLogger = new ConsoleLogger('drawingAdapter')
const eventBusLogger = new ConsoleLogger('eventBus')
const pixijsAdapter = new PixijsDrawingAdapter(inMemoryEventBus, shapeAssets, drawingAdapterLogger)
// throw new Error('Finish Pixi Adapter Public Method coverage')
const resizePixiCanvas = () => pixijsAdapter.changeResolution({ x: window.innerWidth, y: window.innerHeight })
window.addEventListener('resize', resizePixiCanvas)
pixijsAdapter.addingViewToDom(document.body)
resizePixiCanvas()

const waitingIntervalSeconds = 0.03
const waitingTimeSeconds = 3

Promise.all([
    drawFixedEntities(pixijsAdapter),
    drawWalls(pixijsAdapter)
])
    .then(() => {
        drawingAdapterLogger.info(pixijsAdapter.absolutePositionByEntityId(EntityId.playerBRobot))
        drawingAdapterLogger.info(pixijsAdapter.retrieveResolution())
        drawingAdapterLogger.info(pixijsAdapter.retrieveDrawnEntities().get(EntityId.playerBRobot))
        // return setTimeout(() => pixijsAdapter.eraseAll(), waitingTimeSeconds * 1000)
    })
    .catch(error => { throw error })

const interval:NodeJS.Timeout = setTimeout(() => runInterval(pixijsAdapter, interval, drawMovingEntityPhysicals(10, 80), waitingIntervalSeconds), waitingTimeSeconds * 1000)

setTimeout(() => pixijsAdapter.updatePlayerPointerId(EntityId.playerAPointer), waitingTimeSeconds * 1000)
setTimeout(() => eventBusLogger.info(inMemoryEventBus.events), waitingTimeSeconds * 1000 * 3)
