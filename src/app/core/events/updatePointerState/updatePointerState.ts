import { type ControlStatus, makeController } from '../../ecs/components/Controller'
import { EntityType } from '../../ecs/components/EntityReference'
import { makePhysical, type Position } from '../../ecs/components/Physical'
import { EventKind } from '../../type/EventKind'
import { newGameEvent } from '../../type/GameEvent'
import { ShapeType } from '../../type/ShapeType'

export const updatePointerState = (
  playerPointerId: string,
  position: Position,
  primaryButtonStatus: ControlStatus,
) =>
  newGameEvent(
    EventKind.updatePlayerPointerState,
    new Map([[EntityType.pointer, [playerPointerId]]]),
    [
      makePhysical(playerPointerId, position, ShapeType.pointer, true),
      makeController(playerPointerId, primaryButtonStatus),
    ],
  )
