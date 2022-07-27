import { Action } from '../../type/Action'
import { newGameEvent } from '../../type/GameEvent'

export const checkCollisionGameEvent = () => newGameEvent(Action.checkCollision, new Map([]))
