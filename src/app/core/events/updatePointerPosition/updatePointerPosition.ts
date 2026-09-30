import { EntityType } from '../../ecs/components/EntityReference'
import { makePhysical, type Position } from '../../ecs/components/Physical'
import { EventKind } from '../../type/EventKind'
import { newGameEvent } from '../../type/GameEvent'
import { ShapeType } from '../../type/ShapeType'

export const updatePointerPosition = (playerPointerId: string, position: Position) =>
  newGameEvent(
    EventKind.updatePlayerPointerPosition,
    new Map([[EntityType.pointer, [playerPointerId]]]),
    [makePhysical(playerPointerId, position, ShapeType.pointer, true)],
  )
