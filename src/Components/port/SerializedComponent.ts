import { ComponentPropertyType } from '../../EventInteractor/port/ComponentPropertyType'
import { ComponentName } from './ComponentName'

export interface SerializedComponent {
    componentName: ComponentName;
    properties: Map<string, ComponentPropertyType>;
}
