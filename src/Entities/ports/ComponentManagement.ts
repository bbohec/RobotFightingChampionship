import { Component } from '../../Components/port/Component'

export interface ComponentManagement {
    // eslint-disable-next-line no-unused-vars
    hasComponent<T extends Component>(): boolean;
    deleteAllComponents():void
    addComponent(component: Component): void;
}
