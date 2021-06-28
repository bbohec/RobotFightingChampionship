import { it } from 'mocha'
import { GameEvent } from './GameEvent'
import { GenericGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/GenericGameEventDispatcherSystem'
export const whenEventOccurs = (eventDispatcherSystem:GenericGameEventDispatcherSystem, event:GameEvent) => it(eventMessage(event), () => eventDispatcherSystem.onGameEvent(event))
const eventMessage = (event:GameEvent): string => `When the event action '${event.action}' occurs with origin entity '${event.originEntityType}' to target entity '${event.targetEntityType}'.`
