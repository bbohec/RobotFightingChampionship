import { Controller } from '../components/Controller'
import { EntityReference, retrieveReference, retrieveReferences, hasReferences } from '../components/EntityReference'
import { Phasing } from '../components/Phasing'
import { isPositionIdentical, Physical, Position } from '../components/Physical'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { GameEvent } from '../../type/GameEvent'
import { PhaseType } from '../../type/PhaseType'
import { drawEvent } from '../../events/draw/draw'
import { nextTurnEvent } from '../../events/nextTurn/nextTurn'
import { notEnoughActionPointNotificationMessage, notifyPlayerEvent, positionAlreadyOccupiedNotificationMessage, wrongPlayerPhaseNotificationMessage, wrongUnitPhaseNotificationMessage } from '../../events/notifyPlayer/notifyPlayer'
import { ArtithmeticSystem } from '../system'

export const movingEntityNotSupported = 'Moving entity not supported.'

export class MovingSystem extends ArtithmeticSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.action === Action.updatePlayerPointerState) return this.onUpdatePointerPosition(gameEvent)
        const playerId = this.entityByEntityType(gameEvent, EntityType.player)
        const matchPhasingComponent = this.componentRepository.retrieveComponent(retrieveReference(this.entityReferencesByEntityId(playerId), EntityType.match), 'Phasing')
        const movingEntityId = this.movingEntityIdBySupportedEntityTypeAndPhase(gameEvent, matchPhasingComponent)
        return movingEntityId
            ? this.onSupportedMovingEntity(gameEvent, movingEntityId, playerId, matchPhasingComponent)
            : this.sendEvent(notifyPlayerEvent(playerId, movingEntityNotSupported))
    }

    private onSupportedMovingEntity (gameEvent: GameEvent, movingEntityId: string, playerId: string, matchPhasingComponent:Phasing): Promise<void> {
        const cellPhysicalComponent = this.componentRepository.retrieveComponent(this.entityByEntityType(gameEvent, EntityType.cell), 'Physical')
        const movingEntityPhysicalComponent = this.componentRepository.retrieveComponent(movingEntityId, 'Physical')
        const actionPoints = this.movingDistanceBetweenPositions(movingEntityPhysicalComponent.position, cellPhysicalComponent.position)
        return this.isNotPlayerPhase(matchPhasingComponent, playerId)
            ? this.sendEvent(notifyPlayerEvent(playerId, wrongPlayerPhaseNotificationMessage(playerId)))
            : this.isNotUnitPhase(matchPhasingComponent, movingEntityId)
                ? this.sendEvent(notifyPlayerEvent(playerId, wrongUnitPhaseNotificationMessage(matchPhasingComponent.currentPhase)))
                : this.isPositionBusy(this.entityReferencesByEntityId(matchPhasingComponent.entityId), cellPhysicalComponent.position)
                    ? this.sendEvent(notifyPlayerEvent(playerId, positionAlreadyOccupiedNotificationMessage))
                    : this.isNotEnoughActionPoint(matchPhasingComponent, actionPoints)
                        ? this.sendEvent(notifyPlayerEvent(playerId, notEnoughActionPointNotificationMessage))
                        : this.move(movingEntityPhysicalComponent, cellPhysicalComponent, matchPhasingComponent, actionPoints, matchPhasingComponent.entityId)
    }

    private onUpdatePointerPosition (gameEvent: GameEvent): Promise<void> {
        const pointerId = this.entityByEntityType(gameEvent, EntityType.pointer)
        const physicalComponent:Physical = {
            ...this.componentRepository.retrieveComponent(pointerId, 'Physical'),
            position: this.retrievePhysical(gameEvent, pointerId).position
        }
        const controllerComponent:Controller = {
            ...this
                .componentRepository
                .retrieveComponent(pointerId, 'Controller'),
            primaryButton: this.retrieveController(gameEvent, pointerId).primaryButton
        }
        this.componentRepository.saveComponent(physicalComponent)
        this.componentRepository.saveComponent(controllerComponent)
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
        const players = retrieveReferences(entityReferenceComponent, EntityType.player)
        return [
            ...this.entityByEntityTypeFromPlayers(players, EntityType.tower),
            ...this.entityByEntityTypeFromPlayers(players, EntityType.robot)
        ]
            .map(entityId => this.componentRepository.retrieveComponent(entityId, 'Physical'))
            .some(physicalComponent => isPositionIdentical(physicalComponent.position, cellPosition))
    }

    private entityByEntityTypeFromPlayers (matchPlayers: string[], entityType:EntityType):string[] {
        return ([] as string[])
            .concat(...matchPlayers.map(playerId => {
                const playerEntityReference = this.entityReferencesByEntityId(playerId)
                return hasReferences(playerEntityReference, entityType)
                    ? retrieveReference(this.entityReferencesByEntityId(playerId), entityType)
                    : []
            }))
    }

    private move (movingEntityPhysicalComponent:Physical, destinationCellPhysicalComponent:Physical, phasingComponent:Phasing, actionPoints:number, matchId:string):Promise<void> {
        const entityReferenceComponent = this.componentRepository.retrieveComponent(matchId, 'EntityReference')
        this.removeActionPoint(phasingComponent, actionPoints)
        const updatedMovingEntityPhysicalComponent:Physical = {
            ...movingEntityPhysicalComponent,
            position: destinationCellPhysicalComponent.position
        }
        this.componentRepository.saveComponent(updatedMovingEntityPhysicalComponent)
        const events:GameEvent[] = []
        if (phasingComponent.currentPhase.phaseType === PhaseType.Placement && phasingComponent.currentPhase.auto) events.push(nextTurnEvent(matchId))
        retrieveReferences(entityReferenceComponent, EntityType.player).forEach(playerId => events.push(drawEvent(playerId, updatedMovingEntityPhysicalComponent)))
        return this.sendEvents(events)
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
                if (this.hasEntitiesByEntityType(gameEvent, supportedEntityType)) return this.entityByEntityType(gameEvent, supportedEntityType)
        return undefined
    }

    private movingDistanceBetweenPositions (movingEntityPosition: Position, destinationCellPosition: Position):number {
        return Math.floor(this.pythagoreHypotenuse({
            x: Math.abs(destinationCellPosition.x - movingEntityPosition.x),
            y: Math.abs(destinationCellPosition.y - movingEntityPosition.y)
        }))
    }
}
