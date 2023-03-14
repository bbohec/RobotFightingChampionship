import { ControllerPort } from '../../core/port/ControllerPort'

export class InMemoryControllerAdapter implements ControllerPort {
    activate (pointerId: string): Promise<void> {
        this.isInteractive = true
        return Promise.resolve()
    }

    isInteractive: boolean = false
}
