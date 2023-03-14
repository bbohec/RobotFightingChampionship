import { ShapeType } from '../../app/core/type/ShapeType'

export const shapeAssets = new Map([
    [ShapeType.robot, new URL('../shapes/chicken.png', import.meta.url)],
    [ShapeType.tower, new URL('../shapes/tower.png', import.meta.url)],
    [ShapeType.cell, new URL('../shapes/cell.png', import.meta.url)],
    [ShapeType.defeat, new URL('../shapes/defeat.png', import.meta.url)],
    [ShapeType.mainMenu, new URL('../shapes/mainMenu.png', import.meta.url)],
    [ShapeType.pointer, new URL('../shapes/pointer.png', import.meta.url)],
    [ShapeType.simpleMatchLobbyButton, new URL('../shapes/simpleMatchLobbyButton.png', import.meta.url)],
    [ShapeType.simpleMatchLobbyMenu, new URL('../shapes/simpleMatchLobbyMenu.png', import.meta.url)],
    [ShapeType.victory, new URL('../shapes/victory.png', import.meta.url)],
    [ShapeType.nextTurnButton, new URL('../shapes/nextTurnButton.png', import.meta.url)]
])
