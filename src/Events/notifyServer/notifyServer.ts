import { Action } from '../../core/type/Action'
import { GameEvent, newGameEvent } from '../../core/type/GameEvent'

export const notifyServerEvent = (message: string): GameEvent => newGameEvent(Action.notifyServer, new Map(), undefined, message)
