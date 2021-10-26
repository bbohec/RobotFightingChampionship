import { ShapeType } from '../Components/port/ShapeType'
import { PixijsDrawingAdapter } from '../Systems/Drawing/infra/PixijsDrawingAdapter'
import { drawFixedEntities, drawMovingEntityPhysicals, drawWalls, runInterval } from './utils'

export const shapeAssets = new Map([
    [ShapeType.robot, new URL('shapes/chicken.png', import.meta.url)],
    [ShapeType.tower, new URL('shapes/tower.png', import.meta.url)],
    [ShapeType.cell, new URL('shapes/cell.png', import.meta.url)],
    [ShapeType.defeate, new URL('shapes/fire.png', import.meta.url)],
    [ShapeType.mainMenu, new URL('shapes/fire.png', import.meta.url)],
    [ShapeType.pointer, new URL('shapes/fire.png', import.meta.url)],
    [ShapeType.simpleMatchLobby, new URL('shapes/fire.png', import.meta.url)],
    [ShapeType.victory, new URL('shapes/fire.png', import.meta.url)]
])
const pixijsAdapter = new PixijsDrawingAdapter()
// throw new Error('Finish Pixi Adapter Public Method coverage')
const resizePixiCanvas = () => pixijsAdapter.changeResolution({ x: window.innerWidth, y: window.innerHeight })
window.addEventListener('resize', resizePixiCanvas)
pixijsAdapter.addingViewToDom(document.body)
resizePixiCanvas()

const waitingIntervalSeconds = 0.06
const waitingTimeSeconds = 3

drawFixedEntities(pixijsAdapter)
drawWalls(pixijsAdapter)
const interval:NodeJS.Timeout = setTimeout(() => runInterval(pixijsAdapter, interval, drawMovingEntityPhysicals(10, 80), waitingIntervalSeconds), waitingTimeSeconds * 1000)
