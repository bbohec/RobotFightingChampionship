import { EntityId } from '../../../Entities/Entity'

export interface IdentifierAdapter {
    nextIdentifier(): EntityId;
}
