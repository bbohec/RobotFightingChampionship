import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { MainMenu } from './MainMenu'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { Visible } from '../../Component/Visible'
import { InMemoryDrawingAdapter } from '../../Systems/Drawing/infra/InMemoryDrawingAdapter'
import { ClientGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ClientGameEventDispatcherSystem'
import { createMainMenuEvent, MainMenuHide, MainMenuShow } from '../../Events/port/GameEvents'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { ClientLifeCycleSystem } from '../../Systems/LifeCycle/ClientLifeCycleSystem'
import { DrawingSystem } from '../../Systems/Drawing/DrawingSystem'
import { LifeCycle } from '../../Component/LifeCycle'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'

describe('Feature Main Menu', () => {
    describe('Scenario : Main Menu create', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const clientGameEventSystem = new ClientGameEventDispatcherSystem(entityRepository, systemRepository)
        systemRepository.addSystem(new ClientLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter(['Main Menu'])))
        systemRepository.addSystem(clientGameEventSystem)
        it('When the Main Menu is created', () => {
            return clientGameEventSystem.onGameEvent(createMainMenuEvent)
        })
        it('Then the Main Menu is on entities repository', () => {
            expect(() => entityRepository.retrieveEntityByClass(MainMenu)).to.not.throw()
        })
        it('And the Main Menu is created', () => {
            expect(entityRepository.retrieveEntityByClass(MainMenu).retrieveComponent(LifeCycle).isCreated).to.be.true
        })
        it('And the visible component is attached to the Main Menu', () => {
            expect(entityRepository.retrieveEntityByClass(MainMenu).hasComponent(Visible)).to.be.true
        })
        it('And the event "Draw" with destination "Main Menu" is sent', () => {
            expect(clientGameEventSystem.hasEvent(MainMenuShow)).is.true
        })
    })
    describe('Scenario : Main Menu on Draw event', () => {
        const entityRepository = new InMemoryEntityRepository()
        const drawingAdapter = new InMemoryDrawingAdapter()
        const systemRepository = new InMemorySystemRepository()
        const clientGameEventSystem = new ClientGameEventDispatcherSystem(entityRepository, systemRepository)
        systemRepository.systems.add(new DrawingSystem(entityRepository, systemRepository, drawingAdapter))
        systemRepository.systems.add(new ClientLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter(['Main Menu'])))
        systemRepository.systems.add(clientGameEventSystem)
        before(() => {
            return clientGameEventSystem.onGameEvent(createMainMenuEvent)
        })
        it('Given main is not visible', () => {
            expect(drawingAdapter.drawIds.length).equal(0)
        })
        it(`When the clientGameEventSystem receive an event "${MainMenuShow.message}" with destination "${MainMenuShow.destination}"`, () => {
            return clientGameEventSystem.onGameEvent(MainMenuShow)
        })
        it('And the Main Menu become visible', () => {
            expect(drawingAdapter.drawIds.length).equal(1)
        })
    })
    describe('Scenario : Main Menu on Hide event', () => {
        const entityRepository = new InMemoryEntityRepository()
        const drawingAdapter = new InMemoryDrawingAdapter()
        const systemRepository = new InMemorySystemRepository()
        const clientGameEventSystem = new ClientGameEventDispatcherSystem(entityRepository, systemRepository)
        systemRepository.systems.add(new DrawingSystem(entityRepository, systemRepository, drawingAdapter))
        systemRepository.systems.add(clientGameEventSystem)
        before(() => {
            return clientGameEventSystem.onGameEvent(MainMenuShow)
        })
        it('Given main is visible', () => {
            expect(drawingAdapter.drawIds.length).equal(1)
        })
        it('When the clientGameEventSystem receive an event "Hide" with destination "Main Menu"', () => {
            return clientGameEventSystem.onGameEvent(MainMenuHide)
        })
        it('And the Main Menu is not visible', () => {
            expect(drawingAdapter.drawIds.length).equal(0)
        })
    })
})
