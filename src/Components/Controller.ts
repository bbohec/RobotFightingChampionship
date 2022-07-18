import { ControlStatus } from './port/ControlStatus'
import { GenericComponent } from './GenericComponent'
import { EntityId } from '../Entities/Entity'
export type Controller = GenericComponent<'Controller', {
    primaryButton: ControlStatus
}>
export const makeController = (entityId:EntityId, primaryButton:ControlStatus): Controller => ({
    componentType: 'Controller',
    entityId,
    primaryButton
})
