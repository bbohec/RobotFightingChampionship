import { v1 as uuid } from 'uuid'
import { EntityIds } from '../../test/entityIds'
import { PixijsDrawingAdapter } from '../../infra/drawing/PixijsDrawingAdapter'
import { ShapeType } from '../../app/core/type/ShapeType'
import { makePhysical, Physical, position } from '../../app/core/components/Physical'

export function makeHorizontalWall (startingX: number, endingX: number, positionY:number) {
    const physicals:Physical[] = []
    for (let x = startingX; x <= endingX; x++) physicals.push(makePhysical(uuid(), position(x, positionY), ShapeType.cell, true))
    return physicals
}

export function makeVerticalWall (startingY: number, endingY: number, positionX:number) {
    const physicals:Physical[] = []
    for (let y = startingY; y <= endingY; y++) physicals.push(makePhysical(uuid(), position(positionX, y), ShapeType.cell, true))
    return physicals
}

export const drawFixedEntities = (pixijsAdapter:PixijsDrawingAdapter):Promise<void> => {
    return Promise.all([
        makePhysical(EntityIds.playerBRobot, position(115, 15), ShapeType.robot, true),
        makePhysical(EntityIds.playerBTower, position(5, 5), ShapeType.tower, true)
    ].map(physical => pixijsAdapter.refreshEntity(physical)))
        .then(() => Promise.resolve())
        .catch(error => Promise.reject(error))
}

export const drawMovingEntityPhysicals = (staringX:number, targetX:number) => {
    const physicals:Physical[] = []
    for (let x = staringX; x < targetX; x++) physicals.push(makePhysical(EntityIds.playerATower, position(x, 20), ShapeType.tower, true))
    return physicals
}

export const drawWalls = (pixijsAdapter:PixijsDrawingAdapter):Promise<void> => {
    return Promise.all([
        ...makeHorizontalWall(0, 99, 0).map(physical => pixijsAdapter.refreshEntity(physical)),
        ...makeHorizontalWall(0, 99, 119).map(physical => pixijsAdapter.refreshEntity(physical)),
        ...makeVerticalWall(1, 118, 0).map(physical => pixijsAdapter.refreshEntity(physical)),
        ...makeVerticalWall(1, 119, 99).map(physical => pixijsAdapter.refreshEntity(physical))
    ])
        .then(() => Promise.resolve())
        .catch(error => Promise.reject(error))
}
// const erase = (pixijsAdapter:PixijsDrawingAdapter, interval:NodeJS.Timeout, physical: Physical) => pixijsAdapter.refreshEntity(physical).then(() => clearInterval(interval))
const draw = (pixijsAdapter:PixijsDrawingAdapter, physical: Physical) => pixijsAdapter.refreshEntity(physical)
export const drawOrErase = (physical: Physical|undefined, pixijsAdapter:PixijsDrawingAdapter, interval:NodeJS.Timeout) => physical ? draw(pixijsAdapter, physical) : clearInterval(interval)
export const runInterval = (pixijsAdapter:PixijsDrawingAdapter, interval:NodeJS.Timeout, physicals:Physical[], waitingIntervalSeconds:number) => setInterval(() => drawOrErase(physicals.shift(), pixijsAdapter, interval), waitingIntervalSeconds * 1000)
