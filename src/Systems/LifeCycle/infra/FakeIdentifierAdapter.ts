import { v1 as uuid } from 'uuid'
import { IdentifierAdapter } from '../port/IdentifierAdapter'

export class FakeIdentifierAdapter implements IdentifierAdapter {
    constructor (nextIdentifiers?:string[]) {
        this.nextIdentifiers = (nextIdentifiers) || []
    }

    nextIdentifier (): string {
        const nextIdentifier = this.nextIdentifiers.shift()
        return (nextIdentifier) || uuid()
    }

    private nextIdentifiers:string[]
}
