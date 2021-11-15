import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'

export const activatePointerEvent = (pointerId:string) => newGameEvent(Action.activate, new Map([[EntityType.pointer, [pointerId]]]))
