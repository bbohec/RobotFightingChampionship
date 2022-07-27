import { ControlStatus } from '../../type/ControlStatus'
import { EntityInteractor } from '../../port/EntityInteractor'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { updatePointerState } from '../../events/updatePointerState/updatePointerState'
import { ControllerPort } from '../../port/ControllerPort'
import { GenericClientSystem, GenericGameEventDispatcherSystem } from '../system'

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
        return this.interactWithControllerAdapter.activate(this.entityByEntityType(gameEvent, EntityType.pointer))
    }

    private onUpdatePlayerPointerPosition (gameEvent: GameEvent): Promise<void> {
        const pointerEntityId = this.entityByEntityType(gameEvent, EntityType.pointer)
        const pointerPhysicalComponent = this.interactWithEntities.retrievePhysical(pointerEntityId)
        const updatedpointerPhysicalComponent = { ...pointerPhysicalComponent, position: this.retrievePhysical(gameEvent, pointerEntityId).position }
        this.interactWithEntities.saveComponent(updatedpointerPhysicalComponent)
        const event = updatePointerState(pointerEntityId, updatedpointerPhysicalComponent.position, ControlStatus.Active)
        return this.sendEvent(event)
    }

    private interactWithControllerAdapter: ControllerPort
}
