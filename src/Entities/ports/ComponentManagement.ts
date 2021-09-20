import { Component } from '../../Components/port/Component'
import { PotentialClass } from './PotentialClass'
export interface ComponentManagement {
    hasComponent(potentialComponent: PotentialClass<Component>): boolean;
    deleteAllComponents():void
    addComponent(component: Component): void;
}
