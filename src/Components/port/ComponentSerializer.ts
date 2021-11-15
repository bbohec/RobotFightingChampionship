import { GenericComponent } from '../GenericComponent'
import { Physical } from '../Physical'
import { ComponentPropertyType } from '../../EventInteractor/port/ComponentPropertyType'
import { SerializedComponent } from './SerializedComponent'

export class ComponentSerializer {
    public serializeComponent (component: GenericComponent): SerializedComponent {
        return {
            componentName: component.componentName,
            properties: this.propertiesFromComponent(component)
        }
    }

    propertiesFromComponent (component: GenericComponent): Map<string, ComponentPropertyType> {
        const properties = new Map()
        if (component instanceof Physical) {
            properties.set('entityId', component.entityId)
            properties.set('position', component.position)
            properties.set('shape', component.shape)
        }
        return properties
    }
}
