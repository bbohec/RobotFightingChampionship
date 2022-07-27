import { Action } from '../../core/type/Action'
import { newGameEvent } from '../../core/type/GameEvent'

export const checkCollisionGameEvent = () => newGameEvent(Action.checkCollision, new Map([]))
