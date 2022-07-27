import { Action } from '../../core/type/Action'
import { newGameEvent } from '../../core/type/GameEvent'
export const newLoopEvent = newGameEvent(Action.newLoop, new Map())
