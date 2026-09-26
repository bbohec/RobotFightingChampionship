import { EntityType } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import { newGameEvent } from '../../type/GameEvent'

export const quitMatchEvent = (matchId: string, playerId: string) => newGameEvent(EventKind.quit, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [playerId]]
]))
