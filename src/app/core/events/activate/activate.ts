import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { newGameEvent } from '../../type/GameEvent'

export const activatePointerEvent = (pointerId:string) => newGameEvent(EventKind.activate, new Map([[EntityType.pointer, [pointerId]]]))
