import { Test } from 'mocha'
import { GenericGameSystem } from '../../core/ecs/system'
import { GameEvent } from '../../core/type/GameEvent'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { FakeServerAdapters } from '../../infra/game/server/FakeServerAdapters'

export type UnitTestWithContext = (game: GenericGameSystem, adapters: FakeServerAdapters | FakeClientGameAdapters, gameEvents: GameEvent | GameEvent[]) => Test
