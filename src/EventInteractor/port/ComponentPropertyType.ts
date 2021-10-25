import { Dimension } from '../../Components/port/Dimension'
import { Position } from '../../Components/Physical'
import { Phase } from '../../Components/port/Phase'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityType } from '../../Event/EntityType'
import { EntityReferences } from '../../Event/GameEvent'
export type ComponentPropertyType = string | Dimension | EntityReferences | EntityType[] | boolean | number | Set<string> | Position | ShapeType | string[] | Phase;
