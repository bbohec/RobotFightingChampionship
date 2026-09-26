import { ShapeType } from '../type/ShapeType'
import { Controller, ControlStatus } from './components/Controller'
import { Dimension, Dimensional } from './components/Dimensional'
import { EntityReference, EntityReferences, EntityType } from './components/EntityReference'
import { Hittable } from './components/Hittable'
import { LifeCycle } from './components/LifeCycle'
import { Loopable } from './components/Loopable'
import { Offensive } from './components/Offensive'
import { Phase, Phasing } from './components/Phasing'
import { Physical, Position } from './components/Physical'
import { EntityId } from './entity'
export type GenericComponent<C extends string, T extends Record<string, any>> = Readonly<{
    entityId: EntityId;
    componentType: C;
} & T>;
export type Component = Controller | Dimensional | Loopable | Hittable | Offensive | EntityReference | Phasing | Physical | LifeCycle;
export type ComponentType = Component['componentType'];
export type ComponentPropertyType = string | Dimension | EntityReferences | EntityType[] | boolean | number | Set<string> | Position | ShapeType | string[] | Phase | ControlStatus;
