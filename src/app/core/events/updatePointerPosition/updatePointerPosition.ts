import { makePhysical, Position } from '../../ecs/components/Physical'
import { ShapeType } from '../../type/ShapeType'
import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { newGameEvent } from '../../type/GameEvent'

export const updatePointerPosition = (playerPointerId: string, position: Position) => newGameEvent(EventKind.updatePlayerPointerPosition, new Map([[EntityType.pointer, [playerPointerId]]]), [makePhysical(playerPointerId, position, ShapeType.pointer, true)])
