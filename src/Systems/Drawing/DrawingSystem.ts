import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { DrawingPort } from './port/DrawingPort'
import { GenericSystem } from '../Generic/GenericSystem'
import { EntityInteractor } from '../../Entities/GenericEntity/ports/EntityInteractor'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
export class DrawingSystem extends GenericSystem {
    constructor (interactWithEntities: EntityInteractor, gameEventDispatcher: GenericGameEventDispatcherSystem, drawingPort:DrawingPort) {
        super(interactWithEntities, gameEventDispatcher)
        this.drawingPort = drawingPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === 'Show') return this.drawEntities(gameEvent.allEntities())
        if (gameEvent.action === 'Hide') return this.hideEntities(gameEvent.allEntities())
        throw errorMessageOnUnknownEventAction(DrawingSystem.name, gameEvent)
    }

    drawEntities (entities: string[]): Promise<void> {
        return Promise.all(Array.from(entities).map(entityId => this.drawingPort.drawEntity(entityId)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    hideEntities (entities:string[]):Promise<void> {
        return Promise.all(Array.from(entities).map(entityId => this.drawingPort.eraseEntity(entityId)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private drawingPort: DrawingPort
}
