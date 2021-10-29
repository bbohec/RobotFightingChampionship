import { Physical, position } from '../../Components/Physical'
import { v1 as uuid } from 'uuid'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityId } from '../../Event/entityIds'
import { PixijsDrawingAdapter } from '../../Systems/Drawing/infra/PixijsDrawingAdapter'

export function makeHorizontalWall (startingX: number, endingX: number, positionY:number) {
    const physicals:Physical[] = []
    for (let x = startingX; x <= endingX; x++) physicals.push(new Physical(uuid(), position(x, positionY), ShapeType.cell))
    return physicals
}

export function makeVerticalWall (startingY: number, endingY: number, positionX:number) {
    const physicals:Physical[] = []
    for (let y = startingY; y <= endingY; y++) physicals.push(new Physical(uuid(), position(positionX, y), ShapeType.cell))
    return physicals
}

export const drawFixedEntities = (pixijsAdapter:PixijsDrawingAdapter):Promise<void> => {
    return Promise.all([
        new Physical(EntityId.playerBRobot, position(115, 15), ShapeType.robot),
        new Physical(EntityId.playerBTower, position(5, 5), ShapeType.tower)
    ].map(physical => pixijsAdapter.drawEntity(physical)))
        .then(() => Promise.resolve())
        .catch(error => Promise.reject(error))
}

export const drawMovingEntityPhysicals = (staringX:number, targetX:number) => {
    const physicals:Physical[] = []
    for (let x = staringX; x < targetX; x++) physicals.push(new Physical(EntityId.playerATower, position(x, 20), ShapeType.tower))
    return physicals
}

export const drawWalls = (pixijsAdapter:PixijsDrawingAdapter):Promise<void> => {
    return Promise.all([
        ...makeHorizontalWall(0, 99, 0).map(physical => pixijsAdapter.drawEntity(physical)),
        ...makeHorizontalWall(0, 99, 119).map(physical => pixijsAdapter.drawEntity(physical)),
        ...makeVerticalWall(1, 118, 0).map(physical => pixijsAdapter.drawEntity(physical)),
        ...makeVerticalWall(1, 119, 99).map(physical => pixijsAdapter.drawEntity(physical))
    ])
        .then(() => Promise.resolve())
        .catch(error => Promise.reject(error))
}
const erase = (pixijsAdapter:PixijsDrawingAdapter, interval:NodeJS.Timeout) => pixijsAdapter.eraseEntity(EntityId.playerATower).then(() => clearInterval(interval))
const draw = (pixijsAdapter:PixijsDrawingAdapter, physical: Physical) => pixijsAdapter.drawEntity(physical)
export const drawOrErase = (physical: Physical|undefined, pixijsAdapter:PixijsDrawingAdapter, interval:NodeJS.Timeout) => physical ? draw(pixijsAdapter, physical) : erase(pixijsAdapter, interval)
export const runInterval = (pixijsAdapter:PixijsDrawingAdapter, interval:NodeJS.Timeout, physicals:Physical[], waitingIntervalSeconds:number) => setInterval(() => drawOrErase(physicals.shift(), pixijsAdapter, interval), waitingIntervalSeconds * 1000)
