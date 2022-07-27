import { Dimension } from '../core/components/Dimensional'
import { EntityReferences } from '../core/components/EntityReference'
import { Position } from '../core/components/Physical'
import { Component } from '../core/component/Component'
import { ControlStatus } from '../core/components/ControlStatus'
import { ShapeType } from '../core/type/ShapeType'
import { EntityType } from '../core/type/EntityType'
import { entityAlreadyBuild } from '../messages'
import { Entity } from './Entity'
import { InMemoryEntityRepository } from './infra/InMemoryEntityRepository'
import { Phase } from '../core/type/Phase'

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

/*

export const matchBuilder = (EntityId.match:string, matchPhase:Phase, players:string[]) => {
    const match = new Entity(EntityId.match)
    match.addComponent(new Phasing(EntityId.match, matchPhase))
    match.addComponent(new Playable(EntityId.match, players))
    return match
}

export const cellBuilder = (cellId:string, cellPosition:Position) => {
    const cell = new Entity(cellId)
    cell.addComponent(new Physical(cellId, cellPosition))
    return cell
}

export const towerBuilder = (towerId:string, towerPosition:Position) => {
    const towerEntity = new Entity(towerId)
    towerEntity.addComponent(new Physical(towerId, towerPosition))
    return towerEntity
}
*/
