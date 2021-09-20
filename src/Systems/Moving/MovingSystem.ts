import { Phasing } from '../../Components/Phasing'
import { Physical, Position } from '../../Components/Physical'
import { Playable } from '../../Components/Playable'
import { MatchPlayer, PhaseType } from '../../Components/port/Phase'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { badPlayerNotificationMessage, notEnoughActionPointNotificationMessage, notifyEvent, positionAlreadyOccupiedNotificationMessage, wrongPhaseNotificationMessage } from '../../Events/notify/notify'
import { GenericSystem } from '../Generic/GenericSystem'
const unsupportedMovingEntity = (entityTypes:EntityType[]):string => `Unsupported moving entity type. Current entity types: ${entityTypes}`
export class MovingSystem extends GenericSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const playerEntityReference = this.entityReferencesByEntityId(playerId)
        const matchId = playerEntityReference.retreiveReference(EntityType.match)
        const movingEntityId = this.movingEntityIdBySupportedEntityType(gameEvent)
        const cellPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.cell), Physical)
        const matchPhasingComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(matchId, Phasing)
        const matchPlayableComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(matchId, Playable)
        const movingEntityPhysicalComponent = this.interactWithEntities.retrieveEntityComponentByEntityId(movingEntityId, Physical)
        const actionPoints = this.movingDistanceBetweenPositions(movingEntityPhysicalComponent.position, cellPhysicalComponent.position)
        return this.isNotPlayerPlayer(matchPlayableComponent, matchPhasingComponent, playerId)
            ? this.sendEvent(notifyEvent(playerId, badPlayerNotificationMessage(playerId)))
            : this.isNotUnitPhase(
                matchPhasingComponent,
                movingEntityId,
                playerEntityReference.retreiveReference(EntityType.tower),
                playerEntityReference.retreiveReference(EntityType.robot)
            )
                ? this.sendEvent(notifyEvent(playerId, wrongPhaseNotificationMessage(matchPhasingComponent.currentPhase.phaseType)))
                : this.isPositionBusy(matchPlayableComponent, cellPhysicalComponent)
                    ? this.sendEvent(notifyEvent(playerId, positionAlreadyOccupiedNotificationMessage))
                    : this.isNotEnoughActionPoint(matchPhasingComponent, actionPoints)
                        ? this.sendEvent(notifyEvent(playerId, notEnoughActionPointNotificationMessage))
                        : this.move(movingEntityPhysicalComponent, cellPhysicalComponent, matchPhasingComponent, actionPoints)
    }

    private isNotUnitPhase (matchPhasingComponent:Phasing, movingEntityId:string, playerTowerId:string, playerRobotId:string):boolean {
        const phaseAndRelatedEntityMatch = (phaseType:PhaseType, relatedEntityId:string) => matchPhasingComponent.currentPhase.phaseType === phaseType && relatedEntityId === movingEntityId
        return !(phaseAndRelatedEntityMatch(PhaseType.Tower, playerTowerId) || phaseAndRelatedEntityMatch(PhaseType.Robot, playerRobotId))
    }

    private isNotPlayerPlayer (playableComponent:Playable, phasingComponent:Phasing, playerId:string):boolean {
        const matchPlayerMapping :Map<number, MatchPlayer> = new Map([[0, MatchPlayer.A], [1, MatchPlayer.B]])
        return matchPlayerMapping.get(playableComponent.players.findIndex(player => player === playerId)) !== phasingComponent.currentPhase.matchPlayer
    }

    private isNotEnoughActionPoint (phasingComponent: Phasing, movingDistanceBetweenPositions:number):boolean {
        return movingDistanceBetweenPositions > phasingComponent.currentPhase.actionPoints
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
        return ([] as string[])
            .concat(...matchPlayers.map(playerId => {
                const playerEntityReference = this.entityReferencesByEntityId(playerId)
                return playerEntityReference.hasReferences(entityType)
                    ? this.entityReferencesByEntityId(playerId).retreiveReference(entityType)
                    : []
            }))
    }

    private isPositionIdentical (firstPosition: Position, secondPosition: Position):boolean {
        return firstPosition.x === secondPosition.x && firstPosition.y === secondPosition.y
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
        const pythagoreHypotenuse = (position:Position):number => Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2))
        return Math.floor(pythagoreHypotenuse({
            x: Math.abs(destinationCellPosition.x - movingEntityPosition.x),
            y: Math.abs(destinationCellPosition.y - movingEntityPosition.y)
        }))
    }
}
