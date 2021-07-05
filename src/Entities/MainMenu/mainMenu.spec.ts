import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { MainMenu } from './MainMenu'
import { Visible } from '../../Component/Visible'
import { newEvent } from '../../Events/port/GameEvents'
import { LifeCycle } from '../../Component/LifeCycle'
import { EntityType } from '../../Events/port/EntityType'
import { Action } from '../../Events/port/Action'
import { whenEventOccurs } from '../../Events/port/test'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { ClientGame } from '../../Systems/Game/ClientGame'

describe('Feature Main Menu', () => {
    const mainMenuEntityId = 'mainMenu'
    const createMainMenuEvent = newEvent(Action.create, EntityType.nothing, EntityType.mainMenu)
    const mainMenuShowEvent = newEvent(Action.show, EntityType.nothing, EntityType.mainMenu, mainMenuEntityId)
    describe('Scenario : Main Menu create', () => {
        const adapters = new FakeClientAdapters([mainMenuEntityId])
        const game = new ClientGame(adapters)
        whenEventOccurs(game, createMainMenuEvent)
        it('Then the Main Menu is on entities repository', () => {
            expect(() => adapters.entityInteractor.retrieveEntityByClass(MainMenu)).to.not.throw()
        })
        it('And the Main Menu is created', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(MainMenu).retrieveComponent(LifeCycle).isCreated).to.be.true
        })
        it('And the visible component is attached to the Main Menu', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(MainMenu).hasComponent(Visible)).to.be.true
        })
        it('And the event "Draw" with destination "Main Menu" is sent', () => {
            expect(adapters.eventInteractor.hasEvent(mainMenuShowEvent)).is.true
        })
    })
    describe('Scenario : Main Menu on Draw event', () => {
        const adapters = new FakeClientAdapters()
        const game = new ClientGame(adapters)
        before(() => game.onGameEvent(createMainMenuEvent))
        it('Given main is not visible', () => {
            expect(adapters.drawingInteractor.drawIds.length).equal(0)
        })
        whenEventOccurs(game, mainMenuShowEvent)
        it('And the Main Menu become visible', () => {
            expect(adapters.drawingInteractor.drawIds.length).equal(1)
        })
    })
    describe('Scenario : Main Menu on Hide event', () => {
        const adapters = new FakeClientAdapters()
        const game = new ClientGame(adapters)
        const mainMenuHideEvent = newEvent(Action.hide, EntityType.nothing, EntityType.mainMenu, 'mainMenu')
        before(() => game.onGameEvent(mainMenuShowEvent))
        it('Given main is visible', () => {
            expect(adapters.drawingInteractor.drawIds.length).equal(1)
        })
        whenEventOccurs(game, mainMenuHideEvent)
        it('And the Main Menu is not visible', () => {
            expect(adapters.drawingInteractor.drawIds.length).equal(0)
        })
    })
})
