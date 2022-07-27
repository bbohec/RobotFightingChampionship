import { Dimension } from '../components/Dimensional'
import { EntityReferences } from '../components/EntityReference'
import { Position } from '../components/Physical'
import { Component } from '../component/Component'
import { ControlStatus } from '../components/ControlStatus'
import { ShapeType } from '../type/ShapeType'
import { EntityType } from '../type/EntityType'
import { entityAlreadyBuild } from '../../messages'
import { Phase } from '../type/Phase'
import { Entity } from './Entity'
import { InMemoryEntityRepository } from '../../infra/entity/InMemoryEntityRepository'

export class EntityBuilder {
    constructor (entityRepository:InMemoryEntityRepository) {
        this.entityRepository = entityRepository
    }

    withDimension (dimensions:Dimension):this {
        this.addComponents([{ componentType: 'Dimensional', dimensions, entityId: this.getEntityId() }])
        return this
    }

    withController (primaryButton: ControlStatus):this {
        this.addComponents([{ componentType: 'Controller', primaryButton, entityId: this.getEntityId() }])
        return this
    }

    withDamagePoints (damagePoints: number) {
        this.addComponents([{ componentType: 'Offensive', damagePoints, entityId: this.getEntityId() }])
        return this
    }

    withHitPoints (hitPoints: number) {
        this.addComponents([{ componentType: 'Hittable', hitPoints, entityId: this.getEntityId() }])
        return this
    }

    save () {
        if (!this.entity) throw new Error('Missing build entity in builder.')
        this.entityRepository.saveEntity(this.entity)
        this.entity = undefined
        return this
    }

    withLifeCycle (isCreated:boolean = true) {
        this.addComponents([{ componentType: 'LifeCycle', isCreated, entityId: this.getEntityId() }])
        return this
    }

    withEntityReferences (entityType:EntityType|EntityType[], entityReferences: EntityReferences = new Map()) {
        this.addComponents([{ entityReferences, componentType: 'EntityReference', entityId: this.getEntityId(), entityType: Array.isArray(entityType) ? entityType : [entityType] }])
        return this
    }

    withPhysical (position: Position, shapeType:ShapeType, visible:boolean) {
        this.addComponents([{ componentType: 'Physical', entityId: this.getEntityId(), position, shape: shapeType, visible }])
        return this
    }

    withPhase (phase: Phase) {
        this.addComponents([{ componentType: 'Phasing', entityId: this.getEntityId(), currentPhase: phase, readyPlayers: new Set() }])
        return this
    }

    buildRobot (robotId:string, robotPosition:Position) {
        return this.buildEntity(robotId).withPhysical(robotPosition, ShapeType.robot, true)
    }

    buildTower (robotId:string, towerPosition:Position) {
        return this.buildEntity(robotId).withPhysical(towerPosition, ShapeType.tower, true)
    }

    public buildEntity (entityId: string, components?: Component[]) {
        if (this.entity) throw new Error(entityAlreadyBuild)
        this.entity = new Entity(entityId)
        if (components) this.addComponents(components)
        return this
    }

    private addComponents (components: Component[]) {
        if (!this.entity) throw new Error('Missing build entity in builder.')
        this.entity.saveComponents(components)
    }

    private getEntityId (): string {
        if (!this.entity) throw new Error('Missing build entity in builder.')
        return this.entity.id
    }

    private entityRepository:InMemoryEntityRepository
    private entity: Entity|undefined
}
