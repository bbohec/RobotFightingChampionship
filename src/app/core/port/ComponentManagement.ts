import { Component } from '../ecs/component'

export interface ComponentManagement {

    deleteAllComponents():void
    saveComponent(component: Component): void;
}
