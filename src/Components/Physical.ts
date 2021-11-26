import { GenericComponent } from './GenericComponent'
import { Dimension } from './port/Dimension'
import { ShapeType } from './port/ShapeType'

export interface Position {
    x:number
    y:number
}
export const defaultWeaponMaxRange = 10
export const position = (x:number, y:number):Position => ({ x, y })
export const defaultPointerPosition:Position = position(0, 0)
export const defaultJoinSimpleMatchButtonPosition:Position = position(50, 60)
export const playerATowerFirstPosition = ():Position => position(1, 1)
export const playerARobotFirstPosition = ():Position => position(2, 2)
export const playerBTowerFirstPosition = (gridDimension:Dimension):Position => position(gridDimension.x, gridDimension.y)
export const playerBRobotFirstPosition = (gridDimension:Dimension):Position => position(gridDimension.x - 1, gridDimension.y - 1)
export const simpleMatchLobbyPosition = position(10, 10)
export const mainMenuPosition = position(10, 10)
export const victoryPosition = position(10, 10)
export const defeatPosition = position(10, 10)
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
