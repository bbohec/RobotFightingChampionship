import { GenericComponent } from './port/Component'

export type Offensive = GenericComponent<'Offensive', {
    damagePoints: number;
}>

export const makeOffensive = (entityId:string, damagePoints:number): Offensive => ({
    componentType: 'Offensive',
    entityId,
    damagePoints
})
