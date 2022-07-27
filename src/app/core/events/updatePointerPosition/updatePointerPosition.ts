import { makePhysical, Position } from '../../components/Physical'
import { ShapeType } from '../../type/ShapeType'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'

export const updatePointerPosition = (playerPointerId: string, position: Position) => newGameEvent(Action.updatePlayerPointerPosition, new Map([[EntityType.pointer, [playerPointerId]]]), [makePhysical(playerPointerId, position, ShapeType.pointer, true)])
