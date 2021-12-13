import { Physical } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { EntityInteractor } from '../../Entities/ports/EntityInteractor'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { updatePointerState } from '../../Events/updatePointerState/updatePointerState'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { GenericClientSystem } from '../Generic/GenericClientSystem'
import { ControllerPort } from './port/ControllerPort'

export class ControllerSystem extends GenericClientSystem {
    constructor (interactWithEntities: EntityInteractor, gameEventDispatcher: GenericGameEventDispatcherSystem, controllerAdapter:ControllerPort) {
        super(interactWithEntities, gameEventDispatcher)
        this.interactWithControllerAdapter = controllerAdapter
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === Action.updatePlayerPointerPosition
            ? this.onUpdatePlayerPointerPosition(gameEvent)
            : gameEvent.action === Action.activate
                ? this.onActivateController(gameEvent)
                : Promise.reject(new Error(errorMessageOnUnknownEventAction(ControllerSystem.name, gameEvent)))
    }

    private onActivateController (gameEvent: GameEvent): Promise<void> {
        return this.interactWithControllerAdapter.activate(gameEvent.entityByEntityType(EntityType.pointer))
    }

    private onUpdatePlayerPointerPosition (gameEvent: GameEvent): Promise<void> {
        const pointerEntityId = gameEvent.entityByEntityType(EntityType.pointer)
        const pointerPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(pointerEntityId, Physical)
        pointerPhysicalComponent.position = gameEvent.retrieveComponent(pointerEntityId, Physical).position
        return this.sendEvent(updatePointerState(pointerEntityId, pointerPhysicalComponent.position, ControlStatus.Active))
    }

    private interactWithControllerAdapter: ControllerPort
}
