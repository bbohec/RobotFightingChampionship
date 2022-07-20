import { Component, ComponentType } from '../../Components/port/Component'

export interface ComponentManagement {
    // eslint-disable-next-line no-unused-vars
    hasComponent(componentType:ComponentType): boolean;
    deleteAllComponents():void
    saveComponent(component: Component): void;
}
