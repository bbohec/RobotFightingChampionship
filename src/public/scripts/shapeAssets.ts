import { ShapeType } from '../../Components/port/ShapeType'
export const shapeAssets = new Map([
    [ShapeType.robot, new URL('../shapes/chicken.png', import.meta.url)],
    [ShapeType.tower, new URL('../shapes/tower.png', import.meta.url)],
    [ShapeType.cell, new URL('../shapes/cell.png', import.meta.url)],
    [ShapeType.defeate, new URL('../shapes/fire.png', import.meta.url)],
    [ShapeType.mainMenu, new URL('../shapes/mainMenu.png', import.meta.url)],
    [ShapeType.pointer, new URL('../shapes/pointer.png', import.meta.url)],
    [ShapeType.simpleMatchLobby, new URL('../shapes/simpleMatchLobby.png', import.meta.url)],
    [ShapeType.victory, new URL('../shapes/victory.png', import.meta.url)]
])
