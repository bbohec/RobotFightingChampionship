import { v1 as uuid } from 'uuid'
import { EntityId } from '../../core/ecs/entity'
import { Identifier } from '../../core/port/Identifier'

export class FakeIdentifierAdapter implements Identifier {
    constructor (nextIdentifiers?:string[]) {
        this.nextIdentifiers = (nextIdentifiers) || []
    }

    nextIdentifier (): EntityId {
        const nextIdentifier = this.nextIdentifiers.shift()
        return (nextIdentifier) || uuid()
    }

    private nextIdentifiers:string[]
}
