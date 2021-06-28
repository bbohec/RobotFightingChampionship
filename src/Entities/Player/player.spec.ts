import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { newEvent } from '../../Events/port/GameEvents'
import { whenEventOccurs } from '../../Events/port/test'
import { ServerGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ServerGameEventDispatcherSystem'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
const playerId = 'Player A'
const towerId = 'Tower'
describe.skip('Feature Player', () => {
    const entityRepository = new InMemoryEntityRepository()
    const systemRepository = new InMemorySystemRepository()
    const eventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
    const registerTowerOnPlayerEvent = newEvent(Action.register, EntityType.player, playerId, towerId)
    whenEventOccurs(eventDispatcherSystem, registerTowerOnPlayerEvent)
})
