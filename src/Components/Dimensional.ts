import { GenericComponent } from './port/Component'

export type Dimension = {
    x: number;
    y: number;
}

export type Dimensional = GenericComponent<'Dimensional', {
    dimensions: Dimension;
}>

export const makeDimensional = (entityId:string, dimensions:Dimension): Dimensional => ({
    componentType: 'Dimensional',
    entityId,
    dimensions
})

export const matchGridDimension:Dimension = { x: 10, y: 10 }
export const matchOffsetOnGameScreen = 5
export const gameScreenDimension:Dimension = { x: matchGridDimension.x + matchOffsetOnGameScreen * 2, y: matchGridDimension.y + 50 }
export const dimension = (x:number, y:number):Dimension => ({ x, y })
