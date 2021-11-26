import { GenericComponent } from '../GenericComponent'
import { Physical, position, Position } from '../Physical'
import { ShapeType } from './ShapeType'
import { ComponentPropertyType } from '../../EventInteractor/port/ComponentPropertyType'
import { SerializedComponent } from './SerializedComponent'
import { Controller } from '../Controller'
import { ControlStatus } from './ControlStatus'
import { stringifyWithDetailledSetAndMap } from '../../Event/detailledStringify'

export class ComponentBuilder {
    public buildComponent (serializeComponent: SerializedComponent): GenericComponent {
        if (serializeComponent.componentName === Physical.name)
            return this.buildPhysicalComponent(serializeComponent)
        if (serializeComponent.componentName === Controller.name)
            return this.buildControllerComponent(serializeComponent)
        throw new Error(`Unsupported component '${serializeComponent.componentName}'`)
    }

    private buildControllerComponent (serializeComponent: SerializedComponent): Controller {
        console.log(`buildControllerComponent >>>> ${stringifyWithDetailledSetAndMap(serializeComponent)}`)
        return new Controller(
            this.asString(serializeComponent.properties.get('entityId')),
            this.asControlStatus(serializeComponent.properties.get('primaryButton'))
        )
    }

    private buildPhysicalComponent (serializeComponent: SerializedComponent) {
        console.log(`buildPhysicalComponent >>>> ${stringifyWithDetailledSetAndMap(serializeComponent)}`)
        return new Physical(
            this.asString(serializeComponent.properties.get('entityId')),
            this.asPosition(serializeComponent.properties.get('position')),
            this.asShape(serializeComponent.properties.get('shape')),
            this.asBoolean(serializeComponent.properties.get('visible'))
        )
    }

    private asBoolean (property: ComponentPropertyType | undefined): boolean {
        if (typeof property === 'boolean') return property as boolean
        throw new Error(`'${property}' is not boolean`)
    }

    private asString (property: ComponentPropertyType | undefined): string {
        if (typeof property === 'string') return property as string
        throw new Error(`'${property}' is not string`)
    }

    private asPosition (arg: unknown): Position {
        const has = <K extends string>(key: K, x: object): x is { [key in K]: unknown; } => (key in x)
        const isObj = (obj: unknown): obj is Object => typeof obj === 'object'
        if (isObj(arg) && has('x', arg) && typeof arg.x === 'number' && has('y', arg) && typeof arg.y === 'number') return position(arg.x, arg.y)
        throw new Error(`'${arg}' is not postion`)
    }

    private asShape (componentProperty: ComponentPropertyType | undefined): ShapeType {
        const stringProperty = this.asString(componentProperty)
        if (stringProperty in ShapeType) return stringProperty as ShapeType
        throw new Error(`'${componentProperty}' is not ShapeType`)
    }

    asControlStatus (componentProperty: ComponentPropertyType | undefined):ControlStatus {
        const stringProperty = this.asString(componentProperty)
        if (stringProperty in ControlStatus) return stringProperty as ControlStatus
        throw new Error(`'${componentProperty}' is not ControlStatus`)
    }
}
