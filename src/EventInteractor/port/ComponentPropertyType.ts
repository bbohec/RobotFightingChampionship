
import { Position } from '../../Components/Physical'
import { Phase } from '../../Components/port/Phase'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityType } from '../../Event/EntityType'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { EntityReferences } from '../../Components/EntityReference'
import { Dimension } from '../../Components/Dimensional'
export type ComponentPropertyType = string | Dimension | EntityReferences | EntityType[] | boolean | number | Set<string> | Position | ShapeType | string[] | Phase | ControlStatus;
