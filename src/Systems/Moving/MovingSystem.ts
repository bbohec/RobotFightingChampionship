import { Phasing } from '../../Components/Phasing'
import { Physical, Position } from '../../Components/Physical'
import { Playable } from '../../Components/Playable'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { wrongPlayerPhaseNotificationMessage, notEnoughActionPointNotificationMessage, notifyEvent, positionAlreadyOccupiedNotificationMessage, wrongUnitPhaseNotificationMessage } from '../../Events/notify/notify'
import { ArtithmeticSystem } from '../Generic/ArithmeticSystem'
const unsupportedMovingEntity = (entityTypes:EntityType[]):string => `Unsupported moving entity type. Current entity types: ${entityTypes}`
export class MovingSystem extends ArtithmeticSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.updatePlayerPointerState) return this.onUpdatePointerPosition(gameEvent)
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const matchId = this.entityReferencesByEntityId(playerId).retreiveReference(EntityType.match)
        const movingEntityId = this.movingEntityIdBySupportedEntityType(gameEvent)
        const cellPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.cell), Physical)
        const matchPhasingComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(matchId, Phasing)
        const movingEntityPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(movingEntityId, Physical)
        const actionPoints = this.movingDistanceBetweenPositions(movingEntityPhysicalComponent.position, cellPhysicalComponent.position)
        return this.isNotPlayerPhase(matchPhasingComponent, playerId)
            ? this.sendEvent(notifyEvent(playerId, wrongPlayerPhaseNotificationMessage(playerId)))
            : this.isNotUnitPhase(matchPhasingComponent, movingEntityId)
                ? this.sendEvent(notifyEvent(playerId, wrongUnitPhaseNotificationMessage(matchPhasingComponent.currentPhase)))
                : this.isPositionBusy(this.interactWithEntities.retrieveEntityComponentByEntityId(matchId, Playable), cellPhysicalComponent.position)
                    ? this.sendEvent(notifyEvent(playerId, positionAlreadyOccupiedNotificationMessage))
                    : this.isNotEnoughActionPoint(matchPhasingComponent, actionPoints)
                        ? this.sendEvent(notifyEvent(playerId, notEnoughActionPointNotificationMessage))
                        : this.move(movingEntityPhysicalComponent, cellPhysicalComponent, matchPhasingComponent, actionPoints)
    }

    private onUpdatePointerPosition (gameEvent: GameEvent): Promise<void> {
        const pointerId = gameEvent.entityByEntityType(EntityType.pointer)
        this
            .interactWithEntities
            .retrieveEntityComponentByEntityId(pointerId, Physical)
            .position = gameEvent.retrieveComponent(pointerId, Physical).position
        return Promise.resolve()
    }

    private isNotUnitPhase (matchPhasingComponent:Phasing, movingEntityId:string):boolean {
        return matchPhasingComponent.currentPhase.currentUnitId !== movingEntityId
    }

    private isNotPlayerPhase (phasingComponent:Phasing, playerId:string):boolean {
        return phasingComponent.currentPhase.currentPlayerId !== playerId
    }

    private isNotEnoughActionPoint (phasingComponent: Phasing, movingDistanceBetweenPositions:number):boolean {
        return movingDistanceBetweenPositions > phasingComponent.currentPhase.actionPoints
    }

    private isPositionBusy (playableComponent:Playable, cellPosition:Position):boolean {
        return [
            ...this.entityByEntityTypeFromPlayers(playableComponent.players, EntityType.tower),
            ...this.entityByEntityTypeFromPlayers(playableComponent.players, EntityType.robot)
        ]
            .map(entityId => this.interactWithEntities.retrieveEntityComponentByEntityId(entityId, Physical))
            .some(physicalComponent => physicalComponent.isPositionIdentical(cellPosition))
    }

    private entityByEntityTypeFromPlayers (matchPlayers: string[], entityType:EntityType):string[] {
        return ([] as string[])
            .concat(...matchPlayers.map(playerId => {
                const playerEntityReference = this.entityReferencesByEntityId(playerId)
                return playerEntityReference.hasReferences(entityType)
                    ? this.entityReferencesByEntityId(playerId).retreiveReference(entityType)
                    : []
            }))
    }

    private move (movingEntityPhysicalComponent:Physical, destinationCellPhysicalComponent:Physical, phasingComponent:Phasing, actionPoints:number):Promise<void> {
        this.removeActionPoint(phasingComponent, actionPoints)
        this.changePosition(movingEntityPhysicalComponent, destinationCellPhysicalComponent)
        return Promise.resolve()
    }

    private changePosition (movingEntityPhysicalComponent: Physical, destinationEntityPhysicalComponent: Physical) {
        movingEntityPhysicalComponent.position = destinationEntityPhysicalComponent.position
    }

    private removeActionPoint (phasingComponent: Phasing, actionPoint:number) {
        phasingComponent.currentPhase.actionPoints -= actionPoint
    }

    private movingEntityIdBySupportedEntityType (gameEvent: GameEvent):string {
        const supportedEntityTypes : EntityType[] = [EntityType.tower, EntityType.robot]
        for (const supportedEntityType of supportedEntityTypes) if (gameEvent.hasEntitiesByEntityType(supportedEntityType)) return gameEvent.entityByEntityType(supportedEntityType)
        throw new Error(unsupportedMovingEntity(gameEvent.allEntityTypes()))
    }

    private movingDistanceBetweenPositions (movingEntityPosition: Position, destinationCellPosition: Position):number {
        return Math.floor(this.pythagoreHypotenuse({
            x: Math.abs(destinationCellPosition.x - movingEntityPosition.x),
            y: Math.abs(destinationCellPosition.y - movingEntityPosition.y)
        }))
    }
}
