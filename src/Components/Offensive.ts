import { Component, GenericComponent } from './port/Component'

export type Offensive = GenericComponent<'Offensive', {
    damagePoints: number;
}>

const isOffensive = (component:Component): component is Offensive => {
    return component.componentType === 'Offensive'
}

export const toOffensive = (component:Component): Offensive => {
    if (isOffensive(component)) return component as Offensive
    throw new Error(`${component} is not Offensive`)
}

export const makeOffensive = (entityId:string, damagePoints:number): Offensive => ({
    componentType: 'Offensive',
    entityId,
    damagePoints
})
