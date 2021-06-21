import { Component } from '../../../Component/port/Component'
import { PotentialClass } from './PotentialClass'
export interface ComponentManagement {
    hasComponent(potentialComponent: PotentialClass<Component>): boolean;
    addComponent(component: Component): void;
}
