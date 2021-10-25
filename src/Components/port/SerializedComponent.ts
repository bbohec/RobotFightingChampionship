import { ComponentPropertyType } from '../../EventInteractor/port/ComponentPropertyType'

export interface SerializedComponent {
    componentClassName: string;
    properties: Map<string, ComponentPropertyType>;
}
