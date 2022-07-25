import { Component, GenericComponent } from './port/Component'

export type Hittable = GenericComponent<'Hittable', {
    hitPoints: number;
}>
const isHittable = (component:Component): component is Hittable => {
    return component.componentType === 'Hittable'
}

export const toHittable = (component:Component): Hittable => {
    if (isHittable(component)) return component as Hittable
    throw new Error(`${component} is not Offensive`)
}

export const makeHittable = (entityId:string, hitPoints:number): Hittable => ({
    componentType: 'Hittable',
    entityId,
    hitPoints
})
