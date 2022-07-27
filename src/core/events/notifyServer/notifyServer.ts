import { Action } from '../../type/Action'
import { GameEvent, newGameEvent } from '../../type/GameEvent'

export const notifyServerEvent = (message: string): GameEvent => newGameEvent(Action.notifyServer, new Map(), undefined, message)
