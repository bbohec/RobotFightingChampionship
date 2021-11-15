import { ComponentName } from './port/ComponentName'
import { Component } from './port/Component'

export abstract class GenericComponent implements Component {
    constructor (entityId: string) {
        this.entityId = entityId
    }

    abstract componentName:ComponentName;
    entityId: string;
}
