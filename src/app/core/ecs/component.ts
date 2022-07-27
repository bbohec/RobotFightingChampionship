import { Controller } from './components/Controller'
import { Dimensional } from './components/Dimensional'
import { EntityReference } from './components/EntityReference'
import { Hittable } from './components/Hittable'
import { LifeCycle } from './components/LifeCycle'
import { Loopable } from './components/Loopable'
import { Offensive } from './components/Offensive'
import { Phasing } from './components/Phasing'
import { Physical } from './components/Physical'
export type GenericComponent<C extends string, T extends Record<string, any>> = Readonly<{
    entityId: string;
    componentType: C;
} & T>;
export type Component = Controller | Dimensional | Loopable | Hittable | Offensive | EntityReference | Phasing | Physical | LifeCycle;
export type ComponentType = Component['componentType'];