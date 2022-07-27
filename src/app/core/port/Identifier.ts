import { EntityId } from '../ecs/entity/Entity'

export interface Identifier {
    nextIdentifier(): EntityId;
}
