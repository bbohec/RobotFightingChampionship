import { ComponentPropertyType } from '../../EventInteractor/port/ComponentPropertyType'

export interface SerializedComponent {
    componentName: string;
    properties: Map<string, ComponentPropertyType>;
}
