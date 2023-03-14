import { makeController } from '../../ecs/components/Controller'
import { makePhysical, Position } from '../../ecs/components/Physical'
import { ControlStatus } from '../../type/ControlStatus'
import { ShapeType } from '../../type/ShapeType'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'

export const updatePointerState = (playerPointerId: string, position: Position, primaryButtonStatus:ControlStatus) =>
    newGameEvent(
        Action.updatePlayerPointerState,
        new Map([[EntityType.pointer, [playerPointerId]]]),
        [makePhysical(playerPointerId, position, ShapeType.pointer, true), makeController(playerPointerId, primaryButtonStatus)]
    )
