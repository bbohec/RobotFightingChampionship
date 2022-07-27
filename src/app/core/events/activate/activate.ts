import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'

export const activatePointerEvent = (pointerId:string) => newGameEvent(Action.activate, new Map([[EntityType.pointer, [pointerId]]]))
