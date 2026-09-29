import { EventKind } from '../../type/EventKind'
import { GameEvent, newGameEvent } from '../../type/GameEvent'

export const notifyServerEvent = (message: string): GameEvent => newGameEvent(EventKind.notifyServer, new Map(), undefined, message)
