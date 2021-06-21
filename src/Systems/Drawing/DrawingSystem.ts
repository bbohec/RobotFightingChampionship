import { GameEvent } from '../../Events/port/GameEvent'
import { DrawingPort } from './port/DrawingPort'
import { GenericSystem } from '../Generic/GenericSystem'
import { EntityInteractor } from '../../Entities/GenericEntity/ports/EntityInteractor'
import { SystemInteractor } from '../Generic/port/SystemInteractor'
import { errorMessageOnUnknownEventAction } from '../../Events/port/GameEvents'
export class DrawingSystem extends GenericSystem {
    constructor (interactWithEntities: EntityInteractor, interactWithSystems: SystemInteractor, drawingPort:DrawingPort) {
        super(interactWithEntities, interactWithSystems)
        this.drawingPort = drawingPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.message === 'Show') return this.drawingPort.drawEntity(gameEvent.sourceRef)
        if (gameEvent.message === 'Hide') return this.drawingPort.eraseEntity(gameEvent.sourceRef)
        throw errorMessageOnUnknownEventAction(DrawingSystem.name, gameEvent)
    }

    private drawingPort: DrawingPort
}
