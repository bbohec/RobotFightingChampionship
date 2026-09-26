import { EventKind } from '../../type/EventKind'
import { newGameEvent } from '../../type/GameEvent'
export const newLoopEvent = newGameEvent(EventKind.newLoop, new Map())
