import { Test } from 'mocha'
import { GameEvent } from '../../core/type/GameEvent'
import { GenericGameSystem } from '../../Systems/Game/GenericGame'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'

export type UnitTestWithContext = (game: GenericGameSystem, adapters: FakeServerAdapters | FakeClientAdapters, gameEvents: GameEvent | GameEvent[]) => Test
