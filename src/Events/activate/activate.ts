import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'

export const activatePointerEvent = (pointerId:string) => newGameEvent(Action.activate, new Map([[EntityType.pointer, [pointerId]]]))
