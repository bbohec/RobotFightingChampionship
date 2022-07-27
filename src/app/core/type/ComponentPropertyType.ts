
import { Position } from '../ecs/components/Physical'
import { ShapeType } from './ShapeType'
import { EntityType } from './EntityType'
import { ControlStatus } from './ControlStatus'
import { EntityReferences } from '../ecs/components/EntityReference'
import { Dimension } from '../ecs/components/Dimensional'
import { Phase } from './Phase'
export type ComponentPropertyType = string | Dimension | EntityReferences | EntityType[] | boolean | number | Set<string> | Position | ShapeType | string[] | Phase | ControlStatus;
