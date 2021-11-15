import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'
export const newLoopEvent = newGameEvent(Action.newLoop, new Map())
