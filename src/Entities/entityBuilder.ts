import { EntityReference } from '../Components/EntityReference'
import { GenericComponent } from '../Components/GenericComponent'
import { Phasing } from '../Components/Phasing'
import { Position, Physical } from '../Components/Physical'
import { Phase } from '../Components/port/Phase'
import { Entity } from './Entity'
import { EntityReferences } from '../Event/GameEvent'
import { InMemoryEntityRepository } from './infra/InMemoryEntityRepository'
import { LifeCycle } from '../Components/LifeCycle'
import { Hittable } from '../Components/Hittable'
import { Offensive } from '../Components/Offensive'
import { EntityType } from '../Event/EntityType'
import { ShapeType } from '../Components/port/ShapeType'
import { ControlStatus } from '../Components/port/ControlStatus'
import { Controller } from '../Components/Controller'
import { Dimensional } from '../Components/Dimensional'
import { Dimension } from '../Components/port/Dimension'

export class EntityBuilder {
    constructor (entityRepository:InMemoryEntityRepository) {
        this.entityRepository = entityRepository
    }

    withDimension (dimensions:Dimension):this {
        this.addComponents([new Dimensional(this.getEntityId(), dimensions)])
        return this
    }

    withController (controlStatus: ControlStatus):this {
        this.addComponents([new Controller(this.getEntityId(), controlStatus)])
        return this
    }

    withDamagePoints (damagePoints: number) {
        this.addComponents([new Offensive(this.getEntityId(), damagePoints)])
        return this
    }

    withHitPoints (hitPoints: number) {
        this.addComponents([new Hittable(this.getEntityId(), hitPoints)])
        return this
    }

    save () {
        if (!this.entity) throw new Error('Missing build entity in builder.')
        this.entityRepository.saveEntity(this.entity)
        this.entity = undefined
        return this
    }

    withLifeCycle (created?:boolean) {
        const lifeCycleComponent = new LifeCycle(this.getEntityId())
        if (created === true) lifeCycleComponent.isCreated = true
        this.addComponents([lifeCycleComponent])
        return this
    }

    withEntityReferences (entityType:EntityType|EntityType[], entityReferences: EntityReferences = new Map()) {
        this.addComponents([new EntityReference(this.getEntityId(), entityType, entityReferences)])
        return this
    }

    withPhysicalComponent (position: Position, shapeType:ShapeType, visible:boolean) {
        this.addComponents([new Physical(this.getEntityId(), position, shapeType, visible)])
        return this
    }

    withPhase (phase: Phase) {
        this.addComponents([new Phasing(this.getEntityId(), phase)])
        return this
    }

    buildRobot (robotId:string, robotPosition:Position) {
        return this.buildEntity(robotId).withPhysicalComponent(robotPosition, ShapeType.robot, true)
    }

    buildTower (robotId:string, towerPosition:Position) {
        return this.buildEntity(robotId).withPhysicalComponent(towerPosition, ShapeType.tower, true)
    }

    public buildEntity (entityId: string, components?: GenericComponent[]) {
        if (this.entity) throw new Error('Entity already built on builder. Forget save()?')
        this.entity = new Entity(entityId)
        if (components) this.addComponents(components)
        return this
    }

    private addComponents (components: GenericComponent[]) {
        if (!this.entity) throw new Error('Missing build entity in builder.')
        this.entity.addComponents(components)
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
