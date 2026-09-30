import type { ShapeType } from '../type/ShapeType'
import type { Controller, ControlStatus } from './components/Controller'
import type { Dimension, Dimensional } from './components/Dimensional'
import type { EntityReference, EntityReferences, EntityType } from './components/EntityReference'
import type { Hittable } from './components/Hittable'
import type { LifeCycle } from './components/LifeCycle'
import type { Loopable } from './components/Loopable'
import type { Offensive } from './components/Offensive'
import type { Phase, Phasing } from './components/Phasing'
import type { Physical, Position } from './components/Physical'
import type { EntityId } from './entity'

export type GenericComponent<
  C extends string,
  T extends Record<string, ComponentPropertyType>,
> = Readonly<
  {
    entityId: EntityId
    componentType: C
  } & T
>
export type Component =
  | Controller
  | Dimensional
  | Loopable
  | Hittable
  | Offensive
  | EntityReference
  | Phasing
  | Physical
  | LifeCycle
export type ComponentType = Component['componentType']
export type ComponentPropertyType =
  | string
  | Dimension
  | EntityReferences
  | EntityType[]
  | boolean
  | number
  | Set<string>
  | Position
  | ShapeType
  | string[]
  | Phase
  | ControlStatus
