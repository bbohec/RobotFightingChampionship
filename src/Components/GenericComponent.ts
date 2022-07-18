import { ComponentName } from './port/Component'

export type ComponentTypeProperty <C extends ComponentName> = {componentType: C}
export type EntityIdProperty = {entityId: string}

export type GenericComponent <C extends ComponentName, T extends Record<string, any>> = Readonly<EntityIdProperty & ComponentTypeProperty<C> & T >
