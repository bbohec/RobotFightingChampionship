import { makeController } from '../../core/components/Controller'
import { makePhysical, Position } from '../../core/components/Physical'
import { ControlStatus } from '../../core/components/ControlStatus'
import { ShapeType } from '../../core/type/ShapeType'
import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'

export const updatePointerState = (playerPointerId: string, position: Position, primaryButtonStatus:ControlStatus) =>
    newGameEvent(
        Action.updatePlayerPointerState,
        new Map([[EntityType.pointer, [playerPointerId]]]),
        [makePhysical(playerPointerId, position, ShapeType.pointer, true), makeController(playerPointerId, primaryButtonStatus)]
    )
