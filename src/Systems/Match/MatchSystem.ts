import { GenericSystem } from '../Generic/GenericSystem'
import { GameEvent } from '../../Events/port/GameEvent'
import { Playable } from '../../Component/Playable'

export class MatchSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (!gameEvent.destinationId) throw new Error('Missing destinationId')
        this.interactWithEntities.retrieveEntityById(gameEvent.destinationId).retrieveComponent(Playable).players.push(gameEvent.sourceRef)
        return Promise.resolve()
    }
}
