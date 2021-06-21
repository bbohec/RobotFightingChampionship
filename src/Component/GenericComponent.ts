import { Component } from './port/Component'
export abstract class GenericComponent implements Component {
    constructor (entityId: string) { this.entityId = entityId }
    entityId: string;
}
