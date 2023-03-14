import { ComponentRepository } from '../port/ComponentRepository'
import { ControlStatus } from '../type/ControlStatus'
import { EntityType } from '../type/EntityType'
import { Phase } from '../type/Phase'
import { ShapeType } from '../type/ShapeType'
import { Component, ComponentType } from './component'
import { makeController } from './components/Controller'
import { Dimension, makeDimensional } from './components/Dimensional'
import { EntityReferences, makeEntityReference } from './components/EntityReference'
import { makeHittable } from './components/Hittable'
import { makeLifeCycle } from './components/LifeCycle'
import { makeOffensive } from './components/Offensive'
import { makePhasing } from './components/Phasing'
import { Position, makePhysical } from './components/Physical'

interface Flavoring<FlavorT> {
    _type?: FlavorT;
  }
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;
export type EntityId = Flavor<string, 'EntityId'>
export type EntityComponents = Map<ComponentType, Component>

export class EntityBuilder {
    // eslint-disable-next-line no-useless-constructor
    constructor (private componentRepository:ComponentRepository) {}

    public makeEntity (entityId:EntityId):this {
        this.entityId = entityId
        return this
    }

    public save ():this {
        if (!this.entityId) throw new Error('Missing build entity in builder.')
        if (this.components.length === 0) throw new Error('Missing components in builder.')
        this.componentRepository.saveComponents(this.components)
        this.entityId = undefined
        this.components = []
        return this
    }

    public withDimension (dimensions:Dimension):this {
        if (!this.entityId) throw new Error(NoEntityOnBuilder)
        this.addComponent(makeDimensional(this.entityId, dimensions))
        return this
    }

    public withController (primaryButton: ControlStatus):this {
        if (!this.entityId) throw new Error(NoEntityOnBuilder)
        this.addComponent(makeController(this.entityId, primaryButton))
        return this
    }

    public withDamagePoints (damagePoints: number) {
        if (!this.entityId) throw new Error(NoEntityOnBuilder)
        this.addComponent(makeOffensive(this.entityId, damagePoints))
        return this
    }

    public withHitPoints (hitPoints: number) {
        if (!this.entityId) throw new Error(NoEntityOnBuilder)
        this.addComponent(makeHittable(this.entityId, hitPoints))
        return this
    }

    public withLifeCycle (isCreated:boolean = true) {
        if (!this.entityId) throw new Error(NoEntityOnBuilder)
        this.addComponent(makeLifeCycle(this.entityId, isCreated))
        return this
    }

    withEntityReferences (entityType:EntityType|EntityType[], entityReferences: EntityReferences = new Map()) {
        if (!this.entityId) throw new Error(NoEntityOnBuilder)
        this.addComponent(makeEntityReference(this.entityId, entityType, entityReferences))
        return this
    }

    withPhysical (position: Position, shapeType:ShapeType, visible:boolean) {
        if (!this.entityId) throw new Error(NoEntityOnBuilder)
        this.addComponent(makePhysical(this.entityId, position, shapeType, visible))
        return this
    }

    withPhase (phase: Phase) {
        if (!this.entityId) throw new Error(NoEntityOnBuilder)
        this.addComponent(makePhasing(this.entityId, phase))
        return this
    }

    buildRobot (robotId:string, robotPosition:Position) {
        return this.makeEntity(robotId).withPhysical(robotPosition, ShapeType.robot, true)
    }

    buildTower (robotId:string, towerPosition:Position) {
        return this.makeEntity(robotId).withPhysical(towerPosition, ShapeType.tower, true)
    }

    private addComponent (component: Component) {
        this.components.push(component)
    }

    private entityId: EntityId | undefined
    private components: Component[] = []
}

const NoEntityOnBuilder = 'Missing build entity in builder.'
