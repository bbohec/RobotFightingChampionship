import { EntityId } from '../ecs/entity'

export interface Identifier {
    nextIdentifier(): EntityId;
}
