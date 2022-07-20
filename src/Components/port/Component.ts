import { Controller } from '../Controller'
import { Dimensional } from '../Dimensional'
import { EntityReference } from '../EntityReference'
import { Hittable } from '../Hittable'
import { LifeCycle } from '../LifeCycle'
import { Loopable } from '../Loopable'
import { Offensive } from '../Offensive'
import { Phasing } from '../Phasing'
import { Physical } from '../Physical'

export type GenericComponent <C extends string, T extends Record<string, any>> = Readonly<{
    entityId: string
    componentType: C
} & T >

export type Test = GenericComponent<'Test', {osefProp:string}>

export type Component = Controller | Dimensional | Loopable | Hittable | Offensive | EntityReference | Phasing | Physical | LifeCycle | Test;
export type ComponentType = Component['componentType'];

export const isComponent = <T extends Component> (component:Component): component is T => {
    return component.componentType === (component as T).componentType
}

export const toComponent = <T extends Component> (component:Component): T => {
    if (isComponent<T>(component)) return component as T
    throw new Error(`${component} is not a ${(component as T).componentType} component`)
}
