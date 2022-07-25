import { Component } from '../../Components/port/Component'

export interface ComponentManagement {

    deleteAllComponents():void
    saveComponent(component: Component): void;
}
