import { Controller } from '../../Components/Controller'
import { EntityReference } from '../../Components/EntityReference'
import { Phasing } from '../../Components/Phasing'
import { Physical, Position } from '../../Components/Physical'
import { PhaseType } from '../../Components/port/Phase'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { GameEvent } from '../../Event/GameEvent'
import { nextTurnEvent } from '../../Events/nextTurn/nextTurn'
import { wrongPlayerPhaseNotificationMessage, notEnoughActionPointNotificationMessage, notifyPlayerEvent, positionAlreadyOccupiedNotificationMessage, wrongUnitPhaseNotificationMessage } from '../../Events/notifyPlayer/notifyPlayer'
import { drawEvent } from '../../Events/draw/draw'
import { ArtithmeticSystem } from '../Generic/ArithmeticSystem'
export const movingEntityNotSupported = 'Moving entity not supported.'
// const unsupportedMovingEntity = (entityTypes:EntityType[]):string => `Unsupported moving entity type. Current entity types: ${entityTypes}`
export class MovingSystem extends ArtithmeticSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.updatePlayerPointerState) return this.onUpdatePointerPosition(gameEvent)
        const playerId = gameEvent.entityByEntityType(EntityType.player)
        const matchPhasingComponent = this.interactWithEntities.retrieveyComponentByEntityId(this.entityReferencesByEntityId(playerId).retrieveReference(EntityType.match), Phasing)
        const movingEntityId = this.movingEntityIdBySupportedEntityTypeAndPhase(gameEvent, matchPhasingComponent)
        return movingEntityId
            ? this.onSupportedMovingEntity(gameEvent, movingEntityId, playerId, matchPhasingComponent)
            : this.sendEvent(notifyPlayerEvent(playerId, movingEntityNotSupported))
    }

    private onSupportedMovingEntity (gameEvent: GameEvent, movingEntityId: string, playerId: string, matchPhasingComponent:Phasing): Promise<void> {
        const cellPhysicalComponent = this.interactWithEntities.retrieveyComponentByEntityId(gameEvent.entityByEntityType(EntityType.cell), Physical)
        const movingEntityPhysicalComponent = this.interactWithEntities.retrieveyComponentByEntityId(movingEntityId, Physical)
        const actionPoints = this.movingDistanceBetweenPositions(movingEntityPhysicalComponent.position, cellPhysicalComponent.position)
        return this.isNotPlayerPhase(matchPhasingComponent, playerId)
            ? this.sendEvent(notifyPlayerEvent(playerId, wrongPlayerPhaseNotificationMessage(playerId)))
            : this.isNotUnitPhase(matchPhasingComponent, movingEntityId)
                ? this.sendEvent(notifyPlayerEvent(playerId, wrongUnitPhaseNotificationMessage(matchPhasingComponent.currentPhase)))
                : this.isPositionBusy(this.interactWithEntities.retrieveyComponentByEntityId(matchPhasingComponent.entityId, EntityReference), cellPhysicalComponent.position)
                    ? this.sendEvent(notifyPlayerEvent(playerId, positionAlreadyOccupiedNotificationMessage))
                    : this.isNotEnoughActionPoint(matchPhasingComponent, actionPoints)
                        ? this.sendEvent(notifyPlayerEvent(playerId, notEnoughActionPointNotificationMessage))
                        : this.move(movingEntityPhysicalComponent, cellPhysicalComponent, matchPhasingComponent, actionPoints, matchPhasingComponent.entityId)
    }

    private onUpdatePointerPosition (gameEvent: GameEvent): Promise<void> {
        const pointerId = gameEvent.entityByEntityType(EntityType.pointer)
        this
            .interactWithEntities
            .retrieveyComponentByEntityId(pointerId, Physical)
            .position = gameEvent.retrieveComponent(pointerId, Physical).position
        this
            .interactWithEntities
            .retrieveyComponentByEntityId(pointerId, Controller)
            .primaryButton = gameEvent.retrieveComponent(pointerId, Controller).primaryButton
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

    private isPositionBusy (entityReferenceComponent:EntityReference, cellPosition:Position):boolean {
        const players = entityReferenceComponent.retrieveReferences(EntityType.player)
        return [
            ...this.entityByEntityTypeFromPlayers(players, EntityType.tower),
            ...this.entityByEntityTypeFromPlayers(players, EntityType.robot)
        ]
            .map(entityId => this.interactWithEntities.retrieveyComponentByEntityId(entityId, Physical))
            .some(physicalComponent => physicalComponent.isPositionIdentical(cellPosition))
    }

    private entityByEntityTypeFromPlayers (matchPlayers: string[], entityType:EntityType):string[] {
        return ([] as string[])
            .concat(...matchPlayers.map(playerId => {
                const playerEntityReference = this.entityReferencesByEntityId(playerId)
                return playerEntityReference.hasReferences(entityType)
                    ? this.entityReferencesByEntityId(playerId).retrieveReference(entityType)
                    : []
            }))
    }

    private move (movingEntityPhysicalComponent:Physical, destinationCellPhysicalComponent:Physical, phasingComponent:Phasing, actionPoints:number, matchId:string):Promise<void> {
        const entityReferenceComponent = this.interactWithEntities.retrieveyComponentByEntityId(matchId, EntityReference)
        this.removeActionPoint(phasingComponent, actionPoints)
        this.changePosition(movingEntityPhysicalComponent, destinationCellPhysicalComponent)
        const events:GameEvent[] = []
        if (phasingComponent.currentPhase.phaseType === PhaseType.Placement && phasingComponent.currentPhase.auto) events.push(nextTurnEvent(matchId))
        entityReferenceComponent.retrieveReferences(EntityType.player).forEach(playerId => events.push(drawEvent(playerId, movingEntityPhysicalComponent)))
        return this.sendEvents(events)
    }

    private changePosition (movingEntityPhysicalComponent: Physical, destinationEntityPhysicalComponent: Physical) {
        movingEntityPhysicalComponent.position = destinationEntityPhysicalComponent.position
    }

    private removeActionPoint (phasingComponent: Phasing, actionPoint:number) {
        phasingComponent.currentPhase.actionPoints -= actionPoint
    }

    private movingEntityIdBySupportedEntityTypeAndPhase (gameEvent: GameEvent, phasingComponent:Phasing):string|undefined {
        const supportedEntityTypesByPhase : Map<PhaseType, EntityType[]> = new Map([
            [PhaseType.Fight, [EntityType.robot]],
            [PhaseType.Placement, [EntityType.robot, EntityType.tower]]
        ])
        const supportedEntityTypes = supportedEntityTypesByPhase.get(phasingComponent.currentPhase.phaseType)
        if (supportedEntityTypes)
            for (const supportedEntityType of supportedEntityTypes)
                if (gameEvent.hasEntitiesByEntityType(supportedEntityType)) return gameEvent.entityByEntityType(supportedEntityType)
        return undefined
    }

    private movingDistanceBetweenPositions (movingEntityPosition: Position, destinationCellPosition: Position):number {
        return Math.floor(this.pythagoreHypotenuse({
            x: Math.abs(destinationCellPosition.x - movingEntityPosition.x),
            y: Math.abs(destinationCellPosition.y - movingEntityPosition.y)
        }))
    }
}
