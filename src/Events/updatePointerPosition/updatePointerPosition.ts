import { makePhysical, Position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'

export const updatePointerPosition = (playerPointerId: string, position: Position) => newGameEvent(Action.updatePlayerPointerPosition, new Map([[EntityType.pointer, [playerPointerId]]]), [makePhysical(playerPointerId, position, ShapeType.pointer, true)])
