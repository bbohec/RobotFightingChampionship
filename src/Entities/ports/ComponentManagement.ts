import { Component } from '../../core/component/Component'

export interface ComponentManagement {

    deleteAllComponents():void
    saveComponent(component: Component): void;
}
