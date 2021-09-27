import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'

export const checkCollisionGameEvent = () => newGameEvent(Action.checkCollision, new Map([]))
