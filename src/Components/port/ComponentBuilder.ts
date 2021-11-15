import { GenericComponent } from '../GenericComponent'
import { Physical, position, Position } from '../Physical'
import { ShapeType } from './ShapeType'
import { ComponentPropertyType } from '../../EventInteractor/port/ComponentPropertyType'
import { SerializedComponent } from './SerializedComponent'
import { ComponentName } from './ComponentName'

export class ComponentBuilder {
    public buildComponent (serializeComponent: SerializedComponent): GenericComponent {
        console.log('COMPONENT BUILDER', serializeComponent.componentName, '<>', ComponentName.Physical)
        if (serializeComponent.componentName === ComponentName.Physical)
            return this.buildPhyisicalComponent(serializeComponent)
        throw new Error(`Unsupported component '${serializeComponent.componentName}'`)
    }

    private buildPhyisicalComponent (serializeComponent: SerializedComponent) {
        return new Physical(
            this.asString(serializeComponent.properties.get('entityId')),
            this.asPosition(serializeComponent.properties.get('position')),
            this.asShape(serializeComponent.properties.get('shape'))
        )
    }

    private asString (arg: ComponentPropertyType | undefined): string {
        if (typeof arg === 'string') return arg as string
        throw new Error(`'${arg}' is not string`)
    }

    private asPosition (arg: unknown): Position {
        const has = <K extends string>(key: K, x: object): x is { [key in K]: unknown; } => (key in x)
        const isObj = (obj: unknown): obj is Object => typeof obj === 'object'
        if (isObj(arg) && has('x', arg) && typeof arg.x === 'number' && has('y', arg) && typeof arg.y === 'number') return position(arg.x, arg.y)
        throw new Error(`'${arg}' is not postion`)
    }

    private asShape (arg: ComponentPropertyType | undefined): ShapeType {
        const argString = this.asString(arg)
        if (argString in ShapeType) return argString as ShapeType
        throw new Error(`'${arg}' is not ShapeType`)
    }
}
