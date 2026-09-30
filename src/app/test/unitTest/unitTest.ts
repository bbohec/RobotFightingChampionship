import type { Test } from 'mocha'
import type { GenericGameSystem } from '../../core/ecs/system'
import type { GameEvent } from '../../core/type/GameEvent'
import type { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import type { FakeServerAdapters } from '../../infra/game/server/FakeServerAdapters'

export type UnitTestWithContext = (
  game: GenericGameSystem,
  adapters: FakeServerAdapters | FakeClientGameAdapters,
  gameEvents: GameEvent | GameEvent[],
) => Test
