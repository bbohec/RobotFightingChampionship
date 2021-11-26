import { ControlStatus } from './port/ControlStatus'
import { GenericComponent } from './GenericComponent'

export class Controller extends GenericComponent {
    constructor (entityId: string, primaryButton:ControlStatus) {
        super(entityId)
        this.primaryButton = primaryButton
    }

    primaryButton: ControlStatus;
}
