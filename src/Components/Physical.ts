import { EntityId } from '../Entities/Entity'
import { gameScreenDimension, Dimension } from './Dimensional'
import { GenericComponent } from './GenericComponent'
import { ShapeType } from './port/ShapeType'

export type Position = {
    x:number
    y:number
}
export const defaultWeaponMaxRange = 10
export const position = (x:number, y:number):Position => ({ x, y })
export const defaultPointerPosition:Position = position(0, 0)
export const defaultJoinSimpleMatchButtonPosition = position(gameScreenDimension.x / 2, gameScreenDimension.y / 2)
export const playerNextTurnButtonPosition = position(gameScreenDimension.x - 3, gameScreenDimension.y - 3)
export const playerATowerFirstPosition = (gridFirstCellPosition:Position):Position => position(gridFirstCellPosition.x + 1, gridFirstCellPosition.x + 1)
export const playerARobotFirstPosition = (gridFirstCellPosition:Position):Position => position(gridFirstCellPosition.x + 2, gridFirstCellPosition.x + 2)
export const playerBTowerFirstPosition = (gridFirstCellPosition:Position, gridDimension:Dimension):Position => position(gridFirstCellPosition.x + gridDimension.x - 2, gridFirstCellPosition.y + gridDimension.y - 2)
export const playerBRobotFirstPosition = (gridFirstCellPosition:Position, gridDimension:Dimension):Position => position(gridFirstCellPosition.x + gridDimension.x - 3, gridFirstCellPosition.y + gridDimension.y - 3)
export const simpleMatchLobbyPosition = position(10, 10)
export const mainMenuPosition = position(10, 10)
export const victoryPosition = position(gameScreenDimension.x / 2, gameScreenDimension.y / 3)
export const defeatPosition = position(gameScreenDimension.x / 2, gameScreenDimension.y / 3)

export const isPositionIdentical = (position1:Position, position2:Position) => {
    return Math.floor(position1.x) === Math.floor(position2.x) && Math.floor(position1.y) === Math.floor(position2.y)
}

export type Physical = GenericComponent< 'Physical', {
    position: Position
    visible:boolean
    shape:ShapeType
}>

export const makePhysical = (entityId:EntityId, position:Position, shape:ShapeType, visible:boolean):Physical => ({
    componentType: 'Physical',
    entityId,
    position,
    shape,
    visible
})
