import { GenericComponent } from './GenericComponent'

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
export class Physical extends GenericComponent {
    constructor (entityId: string, position: Position) {
        super(entityId)
        this.position = position
    }

    position: Position;
}
