import { GenericComponent } from './GenericComponent'

export type LifeCycle = GenericComponent<'LifeCycle', {
    isCreated: boolean;
}>

export const makeLifeCycle = (entityId:string, isCreated:boolean = true): LifeCycle => ({
    componentType: 'LifeCycle',
    entityId,
    isCreated
})
