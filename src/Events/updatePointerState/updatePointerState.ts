import { makeController } from '../../Components/Controller'
import { makePhysical, Position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { ShapeType } from '../../Components/port/ShapeType'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'

export const updatePointerState = (playerPointerId: string, position: Position, primaryButtonStatus:ControlStatus) =>
    newGameEvent(
        Action.updatePlayerPointerState,
        new Map([[EntityType.pointer, [playerPointerId]]]),
        [makePhysical(playerPointerId, position, ShapeType.pointer, true), makeController(playerPointerId, primaryButtonStatus)]
    )
