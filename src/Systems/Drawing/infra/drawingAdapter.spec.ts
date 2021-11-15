import { describe, before, it, Func } from 'mocha'
import { expect } from 'chai'
import { Physical, Position, position } from '../../../Components/Physical'
import { EntityId } from '../../../Event/entityIds'
import { ShapeType } from '../../../Components/port/ShapeType'
import { Dimension } from '../../../Components/port/Dimension'
import { DrawingAdapter } from '../port/DrawingAdapter'
// import { PixijsDrawingAdapter } from './PixijsDrawingAdapter'
import { DrawingIntegration } from '../port/DrawingIntegration'

interface DrawingAdapterTestSuite {
    entityPhysicalComponent:Physical
    expectedInitialAbsolutePosition:Position
    expectedAbsolutePositionAfterResize: Position
    defaultResolution:Dimension
    resizeResolution: Dimension
}

const adapters:DrawingAdapter[] = [
    // new InMemoryDrawingAdapter(new InMemoryEventBus())
    // new PixijsDrawingAdapter()
]

const testSuites:DrawingAdapterTestSuite[] = [
    {
        entityPhysicalComponent: new Physical(EntityId.playerATower, position(10, 10), ShapeType.tower),
        defaultResolution: { x: 1000, y: 1200 },
        resizeResolution: { x: 2000, y: 2400 },
        expectedInitialAbsolutePosition: position(105, 105),
        expectedAbsolutePositionAfterResize: position(210, 210)
    },
    {
        entityPhysicalComponent: new Physical(EntityId.playerARobot, position(20, 20), ShapeType.robot),
        defaultResolution: { x: 1000, y: 1200 },
        resizeResolution: { x: 3000, y: 3600 },
        expectedInitialAbsolutePosition: position(205, 205),
        expectedAbsolutePositionAfterResize: position(615, 615)
    },
    {
        entityPhysicalComponent: new Physical(EntityId.cellx1y1, position(40, 62), ShapeType.cell),
        defaultResolution: { x: 1000, y: 1200 },
        resizeResolution: { x: 500, y: 600 },
        expectedInitialAbsolutePosition: position(405, 625),
        expectedAbsolutePositionAfterResize: position(202, 312)
    },
    {
        entityPhysicalComponent: new Physical(EntityId.playerAMainMenu, position(40, 62), ShapeType.mainMenu),
        defaultResolution: { x: 2000, y: 2400 },
        resizeResolution: { x: 1000, y: 1200 },
        expectedInitialAbsolutePosition: position(810, 1250),
        expectedAbsolutePositionAfterResize: position(405, 625)
    },
    {
        entityPhysicalComponent: new Physical(EntityId.playerAPointer, position(40, 62), ShapeType.pointer),
        defaultResolution: { x: 2001, y: 2401 },
        resizeResolution: { x: 1001, y: 1201 },
        expectedInitialAbsolutePosition: position(810, 1250),
        expectedAbsolutePositionAfterResize: position(405, 625)
    }
]

const resetAdapter = (adapter:DrawingIntegration, defaultResolution:Dimension): Func => () => {
    adapter.changeResolution(defaultResolution)
    adapter.eraseAll()
}

describe('Integration Test Suite - Drawing Adapters', () => {
    adapters.forEach(adapter => {
        testSuites.forEach((testSuite, index) => {
            describe(`${adapter.constructor.name} - Test Suite  ${index + 1}`, () => {
                describe(`Show Entity on position ${JSON.stringify(testSuite.entityPhysicalComponent.position)} with a resolution of ${JSON.stringify(testSuite.defaultResolution)}`, () => {
                    before(resetAdapter(adapter, testSuite.defaultResolution))
                    it('Given there is no entities drawn.', () => {
                        expect(Array.from(adapter.retrieveDrawnEntities().values()).length).equal(0)
                    })
                    it(`And the adapter resolution is ${JSON.stringify(testSuite.defaultResolution)}`, () => {
                        expect(adapter.retrieveResolution()).deep.equal(testSuite.defaultResolution)
                    })
                    it(`When the entity with the following Physical component is drawn : ${JSON.stringify(testSuite.entityPhysicalComponent)}`, () => {
                        return adapter.drawEntity(testSuite.entityPhysicalComponent)
                    })
                    it('Then the entity is drawn.', () => {
                        expect(adapter.retrieveDrawnEntities().get(testSuite.entityPhysicalComponent.entityId)).deep.equal(testSuite.entityPhysicalComponent)
                    })
                    it(`And the entity absolute position is ${JSON.stringify(testSuite.expectedInitialAbsolutePosition)}.`, () => {
                        expect(adapter.absolutePositionByEntityId(testSuite.entityPhysicalComponent.entityId)).deep.equal(testSuite.expectedInitialAbsolutePosition)
                    })
                })
                describe('Hide Entity', () => {
                    before(resetAdapter(adapter, testSuite.defaultResolution))
                    before(() => adapter.drawEntity(testSuite.entityPhysicalComponent))
                    it('Given the entity is drawn.', () => {
                        expect(adapter.retrieveDrawnEntities().get(testSuite.entityPhysicalComponent.entityId)).deep.equal(testSuite.entityPhysicalComponent)
                    })
                    it(`When the entity with id is erased : ${JSON.stringify(testSuite.entityPhysicalComponent)}`, () => {
                        return adapter.eraseEntity(testSuite.entityPhysicalComponent.entityId)
                    })
                    it('Then there is no entities drawn.', () => {
                        expect(Array.from(adapter.retrieveDrawnEntities().values()).length).equal(0)
                    })
                    it(`And the entity absolute position is ${null}.`, () => {
                        expect(adapter.absolutePositionByEntityId(testSuite.entityPhysicalComponent.entityId)).is.null
                    })
                })
                describe(`Change Resolution from ${JSON.stringify(testSuite.defaultResolution)} to ${JSON.stringify(testSuite.resizeResolution)}`, () => {
                    before(resetAdapter(adapter, testSuite.defaultResolution))
                    before(() => adapter.drawEntity(testSuite.entityPhysicalComponent))
                    it(`Given the entity absolute position is ${JSON.stringify(testSuite.expectedInitialAbsolutePosition)}.`, () => {
                        expect(adapter.absolutePositionByEntityId(testSuite.entityPhysicalComponent.entityId)).deep.equal(testSuite.expectedInitialAbsolutePosition)
                    })
                    it(`When the adapter is resized with the following resolution : ${JSON.stringify(testSuite.resizeResolution)}`, () => {
                        return adapter.changeResolution(testSuite.resizeResolution)
                    })
                    it(`Given the entity absolute position is ${JSON.stringify(testSuite.expectedAbsolutePositionAfterResize)}.`, () => {
                        expect(adapter.absolutePositionByEntityId(testSuite.entityPhysicalComponent.entityId)).deep.equal(testSuite.expectedAbsolutePositionAfterResize)
                    })
                })
            })
        })
    })
})
