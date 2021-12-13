import { Action } from '../../Event/Action'
import { GameEvent, newGameEvent } from '../../Event/GameEvent'

export const notifyServerEvent = (message: string): GameEvent => newGameEvent(Action.notifyServer, new Map(), undefined, message)
