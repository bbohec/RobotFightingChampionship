import { GenericComponent } from './GenericComponent'

export type Hittable = GenericComponent<'Hittable', {
    hitPoints: number;
}>

export const makeHittable = (entityId:string, hitPoints:number): Hittable => ({
    componentType: 'Hittable',
    entityId,
    hitPoints
})
