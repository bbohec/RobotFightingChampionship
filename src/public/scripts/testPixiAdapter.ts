import { EntityId } from '../../Event/entityIds'
import { InMemoryEventBus } from '../../Event/infra/InMemoryEventBus'
import { PixijsDrawingAdapter } from '../../Systems/Drawing/infra/PixijsDrawingAdapter'
import { drawFixedEntities, drawMovingEntityPhysicals, drawWalls, runInterval } from './utils'

const inMemoryEventBus = new InMemoryEventBus()
const pixijsAdapter = new PixijsDrawingAdapter(inMemoryEventBus)
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
        console.log(pixijsAdapter.absolutePositionByEntityId(EntityId.playerBRobot))
        console.log(pixijsAdapter.retrieveResolution())
        console.log(pixijsAdapter.retrieveDrawnEntities().get(EntityId.playerBRobot))
        // return setTimeout(() => pixijsAdapter.eraseAll(), waitingTimeSeconds * 1000)
    })
    .catch(error => console.log(error))

const interval:NodeJS.Timeout = setTimeout(() => runInterval(pixijsAdapter, interval, drawMovingEntityPhysicals(10, 80), waitingIntervalSeconds), waitingTimeSeconds * 1000)

setTimeout(() => pixijsAdapter.updatePlayerPointerId(EntityId.playerAPointer), waitingTimeSeconds * 1000)
setTimeout(() => console.log(inMemoryEventBus.events), waitingTimeSeconds * 1000 * 3)
