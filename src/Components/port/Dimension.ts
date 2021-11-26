export interface Dimension {
    x: number;
    y: number;
}

export const gridDimension:Dimension = { x: 100, y: 120 }
export const dimension = (x:number, y:number):Dimension => ({ x, y })
