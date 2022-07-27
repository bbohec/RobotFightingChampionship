import { ControlStatus } from './ControlStatus'
import { EntityId } from '../../Entities/Entity'
import { Component } from '../component/Component'
import { GenericComponent } from '../component/GenericComponent'

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
