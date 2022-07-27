
import { Position } from '../components/Physical'
import { ShapeType } from './ShapeType'
import { EntityType } from './EntityType'
import { ControlStatus } from '../components/ControlStatus'
import { EntityReferences } from '../components/EntityReference'
import { Dimension } from '../components/Dimensional'
import { Phase } from './Phase'
export type ComponentPropertyType = string | Dimension | EntityReferences | EntityType[] | boolean | number | Set<string> | Position | ShapeType | string[] | Phase | ControlStatus;
