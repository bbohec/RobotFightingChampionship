import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../type/GameEvent'
import { updatePointerState } from '../../events/updatePointerState/updatePointerState'
import { ControllerPort } from '../../port/ControllerPort'
import { GenericClientSystem, GenericGameEventDispatcherSystem } from '../system'
import { ComponentRepository } from '../../port/ComponentRepository'
import { ControlStatus } from '../components/Controller'

export class ControllerSystem extends GenericClientSystem {
    constructor (componentRepository: ComponentRepository, gameEventDispatcher: GenericGameEventDispatcherSystem, controllerAdapter:ControllerPort) {
        super(componentRepository, gameEventDispatcher)
        this.interactWithControllerAdapter = controllerAdapter
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === EventKind.updatePlayerPointerPosition
            ? this.onUpdatePlayerPointerPosition(gameEvent)
            : gameEvent.action === EventKind.activate
                ? this.onActivateController(gameEvent)
                : Promise.reject(new Error(errorMessageOnUnknownEventAction(ControllerSystem.name, gameEvent)))
    }

    private onActivateController (gameEvent: GameEvent): Promise<void> {
        return this.interactWithControllerAdapter.activate(this.entityByEntityType(gameEvent, EntityType.pointer))
    }

    private onUpdatePlayerPointerPosition (gameEvent: GameEvent): Promise<void> {
        const pointerEntityId = this.entityByEntityType(gameEvent, EntityType.pointer)
        const pointerPhysicalComponent = this.componentRepository.retrieveComponent(pointerEntityId, 'Physical')
        const updatedpointerPhysicalComponent = { ...pointerPhysicalComponent, position: this.retrievePhysical(gameEvent, pointerEntityId).position }
        this.componentRepository.saveComponent(updatedpointerPhysicalComponent)
        const event = updatePointerState(pointerEntityId, updatedpointerPhysicalComponent.position, ControlStatus.Active)
        return this.sendEvent(event)
    }

    private interactWithControllerAdapter: ControllerPort
}
