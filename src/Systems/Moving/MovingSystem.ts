import { EntityReference } from '../../Components/EntityReference'
import { Phasing } from '../../Components/Phasing'
import { Physical, Position } from '../../Components/Physical'
import { Playable } from '../../Components/Playable'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { notifyEvent, positionAlreadyOccupiedNotificationMessage } from '../../Events/notify/notify'
import { GenericSystem } from '../Generic/GenericSystem'
export class MovingSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const matchId = this.interactWithEntities.retrieveEntityById(playerId).retrieveComponent(EntityReference).retreiveReference(EntityType.match)
        const cellId = gameEvent.entityByEntityType(EntityType.cell)
        return (this.isPositionBusy(
            this.interactWithEntities.retrieveEntityById(matchId).retrieveComponent(Playable),
            this.interactWithEntities.retrieveEntityById(cellId).retrieveComponent(Physical)
        ))
            ? this.sendEvent(notifyEvent(playerId, positionAlreadyOccupiedNotificationMessage))
            : this.move(
                this.interactWithEntities.retrieveEntityById(this.movingEntityIdBySupportedEntityType(gameEvent)).retrieveComponent(Physical),
                this.interactWithEntities.retrieveEntityById(cellId).retrieveComponent(Physical),
                this.interactWithEntities.retrieveEntityById(matchId).retrieveComponent(Phasing)
            )
        // throw errorMessageOnUnknownEventAction(MovingSystem.name, gameEvent)
    }

    private isPositionBusy (playableComponent:Playable, cellPosition:Physical):boolean {
        return [
            ...this.entityByEntityTypeFromPlayers(playableComponent.players, EntityType.tower),
            ...this.entityByEntityTypeFromPlayers(playableComponent.players, EntityType.robot)
        ]
            .map(entityId => this.interactWithEntities.retrieveEntityById(entityId).retrieveComponent(Physical).position)
            .some(entityPosition => this.isPositionIdentical(entityPosition, cellPosition.position))
    }

    private entityByEntityTypeFromPlayers (matchPlayers: string[], entityType:EntityType):string[] {
        const entities = matchPlayers.map(playerId =>
            (this.interactWithEntities.retrieveEntityById(playerId).retrieveComponent(EntityReference).hasReferences(entityType))
                ? this.interactWithEntities.retrieveEntityById(playerId).retrieveComponent(EntityReference).retrieveReferences(entityType)
                : []
        )
        return ([] as string[]).concat(...entities)
    }

    private isPositionIdentical (firstPosition: Position, secondPosition: Position):boolean {
        return firstPosition.x === secondPosition.x && firstPosition.y === secondPosition.y
    }

    private move (movingEntityPhysicalComponent:Physical, destinationCellPhysicalComponent:Physical, phasingComponent:Phasing):Promise<void> {
        phasingComponent.currentPhase.actionPoints = phasingComponent.currentPhase.actionPoints - this.movingDistanceBetweenPositions(movingEntityPhysicalComponent.position, destinationCellPhysicalComponent.position)
        movingEntityPhysicalComponent.position = destinationCellPhysicalComponent.position
        return Promise.resolve()
    }

    private movingEntityIdBySupportedEntityType (gameEvent: GameEvent):string {
        if (gameEvent.hasEntitiesByEntityType(EntityType.tower) || gameEvent.hasEntitiesByEntityType(EntityType.tower)) {
            return (gameEvent.hasEntitiesByEntityType(EntityType.tower))
                ? gameEvent.entityByEntityType(EntityType.tower)
                : gameEvent.entityByEntityType(EntityType.robot)
        }
        throw new Error('Unsupported moving entity type.')
    }

    private movingDistanceBetweenPositions (movingEntityPosition: Position, destinationCellPosition: Position):number {
        const pythagoreHypotenuse = (position:Position):number => Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2))
        return Math.floor(pythagoreHypotenuse({
            x: Math.abs(destinationCellPosition.x - movingEntityPosition.x),
            y: Math.abs(destinationCellPosition.y - movingEntityPosition.y)
        }))
    }
}
