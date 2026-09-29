import { EventKind } from '../../type/EventKind'
import { newGameEvent } from '../../type/GameEvent'

export const checkCollisionGameEvent = () => newGameEvent(EventKind.checkCollision, new Map([]))
