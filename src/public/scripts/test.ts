/*
import { Application } from 'pixi.js'
import { PixijsControllerAdapter } from '../../app/infra/controller/PixijsControllerAdapter'
import { PixijsDrawingAdapter } from '../../app/infra/drawing/PixijsDrawingAdapter'
import { InMemoryEventBus } from '../../app/infra/eventBus/InMemoryEventBus'
import { ConsoleLogger } from '../../app/infra/logger/consoleLogger'
import { EntityIds } from '../../app/test/entityIds'

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
*/

import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Mesh, MeshBasicMaterial, ColorRepresentation, Vector3, Camera } from 'three'

const makeRenderer = () => {
    const renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    document.body.appendChild(renderer.domElement)
    return renderer
}

type CubeProps = {
    id: string
    color: ColorRepresentation
    position: Vector3
}

const makeCube = ({ id, color, position }: CubeProps) => {
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshBasicMaterial({ color })
    const cube = new Mesh(geometry, material)
    cube.name = id
    cube.position.set(position.x, position.y, position.z)
    return cube
}

type CameraProps = {
    id:string
    position: Vector3
    lookAt: Vector3
}

const makeCamera = ({ id, position, lookAt }: CameraProps) => {
    const camera = new PerspectiveCamera(75, size.width / size.height, 0.1, 1000)
    camera.name = id
    camera.position.set(position.x, position.y, position.z)
    camera.lookAt(lookAt)
    return camera
}

const makeScene = (meshs:Mesh[]) => {
    const scene = new Scene()
    scene.add(...meshs)
    return scene
}

type AnimateProps = {
    fps: number
    scene:Scene
    cameras:Camera[]
    renderers:WebGLRenderer[]
}

const animate = ({ fps, scene, cameras, renderers }: AnimateProps) => {
    setTimeout(() => {
        requestAnimationFrame(() => animate({ fps, scene, cameras, renderers }))
    }, 1000 / fps)
    rotateObject(scene, '1', new Vector3(3 / fps, 2 / fps, 0 / fps))
    rotateObject(scene, '2', new Vector3(2 / fps, 0 / fps, 1 / fps))
    renderers.forEach((_, index) => renderers[index].render(scene, cameras[index]))
}
const rotateObject = (scene: Scene, name:string, vector:Vector3) => {
    const mesh = scene.getObjectByName(name)
    if (!mesh) return
    mesh.rotation.x += vector.x
    mesh.rotation.y += vector.y
    mesh.rotation.z += vector.z
}

const size = { width: 100, height: 150 }

// const canvasMediaStream = rendererHtmlCanvasElement.captureStream()

const cube1 = makeCube({ id: '1', color: 65280, position: new Vector3(3, 0, 1) })
const cube2 = makeCube({ id: '2', color: 43947, position: new Vector3(-3, 0, 0.2) })
const scene = makeScene([cube1, cube2])

const camera1 = makeCamera({ id: '3', position: new Vector3(10, 1, 0), lookAt: new Vector3(0, 0, 0) })
const camera2 = makeCamera({ id: '4', position: new Vector3(-10, 1, 0), lookAt: new Vector3(0, 0, 0) })
const renderer1 = makeRenderer()
const renderer2 = makeRenderer()
const fps = 24
animate({ fps, scene, cameras: [camera1, camera2], renderers: [renderer1, renderer2] })
