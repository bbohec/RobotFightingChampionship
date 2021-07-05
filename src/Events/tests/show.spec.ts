import { describe, before } from 'mocha'
import { mainMenuShowEvent } from '../../Systems/Drawing/DrawingSystem'
import { ClientGameSystem } from '../../Systems/Game/ClientGame'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { createMainMenuEvent } from '../../Systems/LifeCycle/GenericLifeCycleSystem'
import { Action } from '../port/Action'
import { gameEntityId, mainMenuEntityId } from '../port/entityIds'
import { entityIsNotVisible, entityIsVisible, featureEventDescription, whenEventOccurs } from '../port/test'
import { TestStep } from '../port/TestStep'
describe(featureEventDescription(Action.show), () => {
    describe('Scenario : Main Menu on Draw event', () => {
        const adapters = new FakeClientAdapters()
        const game = new ClientGameSystem(adapters)
        before(() => game.onGameEvent(createMainMenuEvent(gameEntityId, mainMenuEntityId)))
        entityIsNotVisible(TestStep.Given, adapters, mainMenuEntityId)
        whenEventOccurs(game, mainMenuShowEvent(mainMenuEntityId))
        entityIsVisible(TestStep.Then, adapters, mainMenuEntityId)
    })
})
