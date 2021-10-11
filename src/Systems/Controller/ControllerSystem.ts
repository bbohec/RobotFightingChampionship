import { Physical } from '../../Components/Physical'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { updatePointerState } from '../../Events/updatePointerState/updatePointerState'
import { GenericClientSystem } from '../Generic/GenericClientSystem'

export class ControllerSystem extends GenericClientSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.updatePlayerPointerPosition) return this.onUpdatePlayerPointerPosition(gameEvent)
        throw new Error(errorMessageOnUnknownEventAction(ControllerSystem.name, gameEvent))
    }

    onUpdatePlayerPointerPosition (gameEvent: GameEvent): Promise<void> {
        const pointerEntityId = gameEvent.entityByEntityType(EntityType.pointer)
        const pointerPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(pointerEntityId, Physical)
        if (!pointerPhysicalComponent.isPositionIdentical(gameEvent.retrieveComponent(pointerEntityId, Physical).position)) {
            pointerPhysicalComponent.position = gameEvent.retrieveComponent(pointerEntityId, Physical).position
            return this.sendEvent(updatePointerState(pointerEntityId, pointerPhysicalComponent.position))
        }
        return Promise.resolve()
    }
}
