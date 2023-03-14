import { Component, GenericComponent } from '../component'

export type LifeCycle = GenericComponent<'LifeCycle', {
    isCreated: boolean;
}>

const isLifeCycle = (component:Component): component is LifeCycle => {
    return component.componentType === 'LifeCycle'
}

export const toLifeCycle = (component:Component): LifeCycle => {
    if (isLifeCycle(component)) return component as LifeCycle
    throw new Error(`${component} is not Controller`)
}

export const makeLifeCycle = (entityId:string, isCreated:boolean = true): LifeCycle => ({
    componentType: 'LifeCycle',
    entityId,
    isCreated
})
