import { GenericComponent } from '../GenericComponent'
import { Physical } from '../Physical'
import { ComponentPropertyType } from '../../EventInteractor/port/ComponentPropertyType'
import { SerializedComponent } from './SerializedComponent'
import { Controller } from '../Controller'

export class ComponentSerializer {
    public serializeComponent (component: GenericComponent): SerializedComponent {
        return {
            componentName: component.constructor.name,
            properties: this.propertiesFromComponent(component)
        }
    }

    propertiesFromComponent (component: GenericComponent): Map<string, ComponentPropertyType> {
        const properties = new Map()
        if (component instanceof Physical) {
            properties.set('entityId', component.entityId)
            properties.set('position', component.position)
            properties.set('shape', component.shape)
            properties.set('visible', component.visible)
        }
        if (component instanceof Controller) {
            properties.set('entityId', component.entityId)
            properties.set('primaryButton', component.primaryButton)
        }
        return properties
    }
}
