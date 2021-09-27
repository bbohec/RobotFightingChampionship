import { EntityReference } from '../Components/EntityReference'
import { GenericComponent } from '../Components/GenericComponent'
import { Phasing } from '../Components/Phasing'
import { Position, Physical } from '../Components/Physical'
import { Playable } from '../Components/Playable'
import { Phase } from '../Components/port/Phase'
import { Entity } from './Entity'
import { EntityReferences } from '../Event/GameEvent'
import { InMemoryEntityRepository } from './infra/InMemoryEntityRepository'
import { LifeCycle } from '../Components/LifeCycle'
import { Visible } from '../Components/Visible'
import { Hittable } from '../Components/Hittable'
import { Offensive } from '../Components/Offensive'
import { EntityType } from '../Event/EntityType'

export class EntityBuilder {
    withDamagePoints (damagePoints: number) {
        this.addComponents([new Offensive(this.getEntityId(), damagePoints)])
        return this
    }

    withHitPoints (hitPoints: number) {
        this.addComponents([new Hittable(this.getEntityId(), hitPoints)])
        return this
    }

    constructor (entityRepository:InMemoryEntityRepository) {
        this.entityRepository = entityRepository
    }

    save () {
        if (!this.entity) throw new Error('Missing build entity in builder.')
        this.entityRepository.saveEntity(this.entity)
        this.entity = undefined
        return this
    }

    withVisibility (visible: boolean) {
        this.addComponents([new Visible(this.getEntityId())])
        return this
    }

    withLifeCycle (created?:boolean) {
        const lifeCycleComponent = new LifeCycle(this.getEntityId())
        if (created === true) lifeCycleComponent.isCreated = true
        this.addComponents([lifeCycleComponent])
        return this
    }

    withEntityReferences (entityType:EntityType|EntityType[], entityReferences: EntityReferences) {
        this.addComponents([new EntityReference(this.getEntityId(), entityType, entityReferences)])
        return this
    }

    withPhysicalComponent (position: Position) {
        this.addComponents([new Physical(this.getEntityId(), position)])
        return this
    }

    withPhase (phase: Phase) {
        this.addComponents([new Phasing(this.getEntityId(), phase)])
        return this
    }

    withPlayers (playerIds: string[]) {
        this.addComponents([new Playable(this.getEntityId(), playerIds)])
        return this
    }

    robotBuilder (robotId:string, robotPosition:Position) {
        return this.buildEntity(robotId, [
            new Physical(robotId, robotPosition)
        ])
    }

    public buildEntity (entityId: string, components?: GenericComponent[]) {
        if (this.entity) throw new Error('Entity already built on builder. Forget add()?')
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
