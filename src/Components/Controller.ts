import { ControlStatus } from './port/ControlStatus'
import { EntityId } from '../Entities/Entity'
import { GenericComponent } from './port/Component'

export type Controller = GenericComponent<'Controller', {
    primaryButton: ControlStatus
}>
export const makeController = (entityId:EntityId, primaryButton:ControlStatus): Controller => ({
    componentType: 'Controller',
    entityId,
    primaryButton
})
