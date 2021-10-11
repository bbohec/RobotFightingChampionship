import { GenericComponent } from './GenericComponent'
import { ShapeType } from './port/ShapeType'

export interface Position {
    x:number
    y:number
}
export const defaultWeaponMaxRange = 10
export const position = (x:number, y:number):Position => ({ x, y })
export const playerATowerFirstPosition:Position = position(1, 1)
export const playerARobotFirstPosition:Position = position(2, 2)
export const playerBTowerFirstPosition:Position = position(24, 24)
export const playerBRobotFirstPosition:Position = position(23, 23)
export const simpleMatchLobbyPosition = position(10, 10)
export const mainMenuPosition = position(10, 10)
export const victoryPosition = position(10, 10)
export const defeatPosition = position(10, 10)
export class Physical extends GenericComponent {
    constructor (entityId: string, position: Position, shape:ShapeType) {
        super(entityId)
        this.position = position
        this.shape = shape
    }

    public isPositionIdentical (position:Position) {
        return Math.floor(position.x) === Math.floor(this.position.x) && Math.floor(position.y) === Math.floor(this.position.y)
    }

    position: Position;
    shape:ShapeType
}
