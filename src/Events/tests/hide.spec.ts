import { describe, before } from 'mocha'
import { mainMenuShowEvent, mainMenuHideEvent } from '../../Systems/Drawing/DrawingSystem'
import { ClientGameSystem } from '../../Systems/Game/ClientGame'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { Action } from '../port/Action'
import { mainMenuEntityId } from '../port/entityIds'
import { entityIsNotVisible, entityIsVisible, featureEventDescription, whenEventOccurs } from '../port/test'
import { TestStep } from '../port/TestStep'
describe(featureEventDescription(Action.hide), () => {
    describe('Scenario : Main Menu on Hide event', () => {
        const adapters = new FakeClientAdapters()
        const game = new ClientGameSystem(adapters)
        before(() => game.onGameEvent(mainMenuShowEvent(mainMenuEntityId)))
        entityIsVisible(TestStep.Given, adapters, mainMenuEntityId)
        whenEventOccurs(game, mainMenuHideEvent(mainMenuEntityId))
        entityIsNotVisible(TestStep.Then, adapters, mainMenuEntityId)
    })
})
