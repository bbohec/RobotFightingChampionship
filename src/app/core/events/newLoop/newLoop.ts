import { Action } from '../../type/Action'
import { newGameEvent } from '../../type/GameEvent'
export const newLoopEvent = newGameEvent(Action.newLoop, new Map())
