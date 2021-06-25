import { GameEvent } from '../../Events/port/GameEvent'
import { DrawingPort } from './port/DrawingPort'
import { GenericSystem } from '../Generic/GenericSystem'
import { EntityInteractor } from '../../Entities/GenericEntity/ports/EntityInteractor'
import { SystemInteractor } from '../Generic/port/SystemInteractor'
import { errorMessageOnUnknownEventAction, MissingTargetEntityId } from '../../Events/port/GameEvents'
export class DrawingSystem extends GenericSystem {
    constructor (interactWithEntities: EntityInteractor, interactWithSystems: SystemInteractor, drawingPort:DrawingPort) {
        super(interactWithEntities, interactWithSystems)
        this.drawingPort = drawingPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.targetEntityId === undefined) throw new Error(MissingTargetEntityId)
        if (gameEvent.action === 'Show') return this.drawingPort.drawEntity(gameEvent.targetEntityId)
        if (gameEvent.action === 'Hide') return this.drawingPort.eraseEntity(gameEvent.targetEntityId)
        throw errorMessageOnUnknownEventAction(DrawingSystem.name, gameEvent)
    }

    private drawingPort: DrawingPort
}
