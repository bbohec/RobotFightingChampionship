import { EntityId } from '../entity/Entity'

export interface Identifier {
    nextIdentifier(): EntityId;
}
