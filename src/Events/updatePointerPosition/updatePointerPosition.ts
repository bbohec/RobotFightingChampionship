import { makePhysical, Position } from '../../core/components/Physical'
import { ShapeType } from '../../core/type/ShapeType'
import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'

export const updatePointerPosition = (playerPointerId: string, position: Position) => newGameEvent(Action.updatePlayerPointerPosition, new Map([[EntityType.pointer, [playerPointerId]]]), [makePhysical(playerPointerId, position, ShapeType.pointer, true)])
