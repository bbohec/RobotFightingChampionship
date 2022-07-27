import { Test } from 'mocha'
import { GenericGameSystem } from '../../app/core/system/GenericGameSystem'
import { GameEvent } from '../../app/core/type/GameEvent'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { FakeServerAdapters } from '../../infra/game/server/FakeServerAdapters'

export type UnitTestWithContext = (game: GenericGameSystem, adapters: FakeServerAdapters | FakeClientGameAdapters, gameEvents: GameEvent | GameEvent[]) => Test
