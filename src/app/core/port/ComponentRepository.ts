import { Component, ComponentType } from '../ecs/component'
import { EntityReference } from '../ecs/components/EntityReference'
import { Physical } from '../ecs/components/Physical'
import { EntityId } from '../ecs/entity'

export interface ComponentRepository {
    retrievePhysicals(entityIds: EntityId[]|undefined): (Physical|undefined)[]
    retrieveEntityReferences(entityIds: EntityId[]|undefined): (EntityReference|undefined)[]
    retrieveComponent<C extends ComponentType>(id: EntityId, componentType: C): Extract<Component, {componentType: C}>
    saveComponent(component: Component): void;
    saveComponents(components: Component[]):void
    deleteEntityComponents(entityId: EntityId):void
    entitiesWithType (componentType:ComponentType): EntityId[];
}
