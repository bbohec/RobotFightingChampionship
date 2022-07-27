import { Component } from '../component/Component'

export interface ComponentManagement {

    deleteAllComponents():void
    saveComponent(component: Component): void;
}
