import { GenericComponent } from './GenericComponent'
import { Dimension, gameScreenDimension } from './port/Dimension'
import { ShapeType } from './port/ShapeType'

export interface Position {
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
export class Physical extends GenericComponent {
    constructor (entityId: string, position: Position, shape:ShapeType, visible:boolean) {
        super(entityId)
        this.position = position
        this.shape = shape
        this.visible = visible
    }

    public isPositionIdentical (position:Position) {
        return Math.floor(position.x) === Math.floor(this.position.x) && Math.floor(position.y) === Math.floor(this.position.y)
    }

    position: Position
    visible:boolean
    shape:ShapeType
}
