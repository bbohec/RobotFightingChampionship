export interface Dimension {
    x: number;
    y: number;
}

export const matchGridDimension:Dimension = { x: 10, y: 10 }
export const matchOffsetOnGameScreen = 5
export const gameScreenDimension:Dimension = { x: matchGridDimension.x + matchOffsetOnGameScreen * 2, y: matchGridDimension.y + 50 }
export const dimension = (x:number, y:number):Dimension => ({ x, y })
