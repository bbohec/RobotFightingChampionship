import { Controller } from '../Controller'
import { Dimensional } from '../Dimensional'
import { EntityReference } from '../EntityReference'
import { Hittable } from '../Hittable'
import { LifeCycle } from '../LifeCycle'
import { Loopable } from '../Loopable'
import { Offensive } from '../Offensive'
import { Phasing } from '../Phasing'
import { Physical } from '../Physical'

export type ComponentName = 'Controller' | 'Dimensional' | 'Loopable' | 'Hittable' | 'Offensive' | 'EntityReference' | 'Phasing' | 'Physical' |'LifeCycle';

export type Component = Controller | Dimensional | Loopable | Hittable | Offensive | EntityReference | Phasing | Physical | LifeCycle;

export const isComponent = <T extends Component>(component: Component) : component is T => component.componentType === ({} as T).componentType
