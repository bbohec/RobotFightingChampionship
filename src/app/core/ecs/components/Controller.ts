import { ControlStatus } from '../../type/ControlStatus'
import { Component, GenericComponent } from '../component'
import { EntityId } from '../entity'

export type Controller = GenericComponent<'Controller', {
    primaryButton: ControlStatus
}>
export const makeController = (entityId:EntityId, primaryButton:ControlStatus): Controller => ({
    componentType: 'Controller',
    entityId,
    primaryButton
})

const isController = (component:Component): component is Controller => {
    return component.componentType === 'Controller'
}

export const toController = (component:Component): Controller => {
    if (isController(component)) return component as Controller
    throw new Error(`${component} is not Controller`)
}
