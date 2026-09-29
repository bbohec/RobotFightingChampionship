import { ControlStatus, makeController } from '../../ecs/components/Controller'
import { makePhysical, Position } from '../../ecs/components/Physical'
import { ShapeType } from '../../type/ShapeType'
import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { newGameEvent } from '../../type/GameEvent'

export const updatePointerState = (playerPointerId: string, position: Position, primaryButtonStatus:ControlStatus) =>
    newGameEvent(
        EventKind.updatePlayerPointerState,
        new Map([[EntityType.pointer, [playerPointerId]]]),
        [makePhysical(playerPointerId, position, ShapeType.pointer, true), makeController(playerPointerId, primaryButtonStatus)]
    )
