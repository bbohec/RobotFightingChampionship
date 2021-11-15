import { Controller } from '../../Components/Controller'
import { Physical, Position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { ShapeType } from '../../Components/port/ShapeType'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'

export const updatePointerState = (playerPointerId: string, position: Position, primaryButtonStatus:ControlStatus) => newGameEvent(Action.updatePlayerPointerState, new Map([[EntityType.pointer, [playerPointerId]]]), [new Physical(playerPointerId, position, ShapeType.pointer), new Controller(playerPointerId, primaryButtonStatus)])
