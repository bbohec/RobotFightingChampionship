import { ComponentPropertyType } from '../../Systems/GameEventDispatcher/port/ComponentPropertyType'

export interface SerializedComponent {
    componentClassName: string;
    properties: Map<string, ComponentPropertyType>;
}
