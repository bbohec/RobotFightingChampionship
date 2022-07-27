import { missingEntityId } from '../../../infra/entity/InMemoryEntityRepository'
import { Controller } from '../components/Controller'
import { ControlStatus } from '../../type/ControlStatus'
import { EntityReference, retrieveReference, retrieveReferences, hasReferences } from '../components/EntityReference'
import { getCurrentUnitId, Phasing } from '../components/Phasing'
import { Physical, Position, isPositionIdentical } from '../components/Physical'
import { attackEvent } from '../../events/attack/attack'
import { collisionGameEvent } from '../../events/collision/collision'
import { joinSimpleMatchLobby } from '../../events/join/join'
import { moveEvent } from '../../events/move/move'
import { nextTurnEvent } from '../../events/nextTurn/nextTurn'
import { notifyServerEvent } from '../../events/notifyServer/notifyServer'
import { quitMatchEvent } from '../../events/quit/quit'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { GameEvent, errorMessageOnUnknownEventAction } from '../../type/GameEvent'
import { PhaseType } from '../../type/PhaseType'
import { GenericServerSystem } from '../system'

export class CollisionSystem extends GenericServerSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        return gameEvent.action === Action.checkCollision
            ? this.onCheckCollision()
            : gameEvent.action === Action.collision
                ? this.onCollision(gameEvent)
                : Promise.reject(new Error(errorMessageOnUnknownEventAction(CollisionSystem.name, gameEvent)))
    }

    private entityReferencesWithEntityType (entityReferenceComponents: EntityReference[], entityType:EntityType):EntityReference[] {
        return entityReferenceComponents.filter(entityReference => entityReference.entityType.some(entityReferenceEntityType => entityReferenceEntityType === entityType))
    }

    private onCollision (gameEvent: GameEvent): Promise<void> {
        const entities = this.entitiesByEntityType(gameEvent, EntityType.unknown)
        const entityReferences = this.componentRepository.retrieveEntityReferences(entities)
        const existingEntityReference:EntityReference[] = []
        for (const entityReference of entityReferences)
            if (entityReference)existingEntityReference.push(entityReference)
        const missingEntities = entities.filter(entity => !existingEntityReference.some(entityReference => entityReference.entityId === entity))
        const pointerEntityReference = this.entityReferencesWithEntityType(existingEntityReference, EntityType.pointer)
        const pointerCollisionGeneratedEvents:GameEvent[] = []
        pointerEntityReference.forEach(pointerEntityReference => {
            pointerCollisionGeneratedEvents.push(...this.onPointerCollisionEvents(
                retrieveReference(pointerEntityReference, EntityType.player),
                this.componentRepository.retrieveController(pointerEntityReference.entityId),
                existingEntityReference
            ))
        })
        return Promise.all([
            ...pointerCollisionGeneratedEvents.map(gameEvent => this.sendEvent(gameEvent)),
            ...missingEntities.map(missingEntity => this.sendEvent(notifyServerEvent(missingEntityId(missingEntity))))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private onPointerCollisionEvents (playerId:string, controller:Controller, collisionnedEntityReferenceComponents:EntityReference[]):GameEvent[] {
        const generatedPointerCollisionEvents:GameEvent[] = []
        if (controller.primaryButton === ControlStatus.Active) {
            const updatedController:Controller = { ...controller, primaryButton: ControlStatus.Idle }
            this.componentRepository.saveComponent(updatedController)
            const cellEntityReferences = this.entityReferencesWithEntityType(collisionnedEntityReferenceComponents, EntityType.cell)
            const robotEntityReferences = this.entityReferencesWithEntityType(collisionnedEntityReferenceComponents, EntityType.robot)
            const towerEntityReferences = this.entityReferencesWithEntityType(collisionnedEntityReferenceComponents, EntityType.tower)
            generatedPointerCollisionEvents.push(...this.pointerAndButtonCollisionEvents(playerId, this.entityReferencesWithEntityType(collisionnedEntityReferenceComponents, EntityType.button)))
            generatedPointerCollisionEvents.push(...this.pointerAndNextTurnButtonCollisionEvents(playerId, this.entityReferencesWithEntityType(collisionnedEntityReferenceComponents, EntityType.nextTurnButton)))
            generatedPointerCollisionEvents.push(...this.pointerAndDefeatCollisionEvents(playerId, this.entityReferencesWithEntityType(collisionnedEntityReferenceComponents, EntityType.defeat)))
            generatedPointerCollisionEvents.push(...this.pointerAndVictoryCollisionEvents(playerId, this.entityReferencesWithEntityType(collisionnedEntityReferenceComponents, EntityType.victory)))
            generatedPointerCollisionEvents.push(...this.pointerAndCellAndUnitCollisionEvents(playerId, cellEntityReferences, towerEntityReferences))
            generatedPointerCollisionEvents.push(...this.pointerAndCellAndUnitCollisionEvents(playerId, cellEntityReferences, robotEntityReferences))
            generatedPointerCollisionEvents.push(...this.pointerAndCellColisionEvents(playerId, cellEntityReferences, towerEntityReferences, robotEntityReferences))
        }
        return generatedPointerCollisionEvents
    }

    private pointerAndVictoryCollisionEvents (playerId: string, victoryEntityReferences: EntityReference[]):GameEvent[] {
        const generatedPointerAndDefeatCollisionEvents:GameEvent[] = []
        victoryEntityReferences.forEach(victoryEntityReference => {
            const matchId = retrieveReference(victoryEntityReference, EntityType.match)
            const physical = this.componentRepository.retrievePhysical(victoryEntityReference.entityId)
            if (!physical) throw new Error(`Missing physical for entity ${victoryEntityReference.entityId}`)
            if (
                this.isPlayerOnMatch(matchId, playerId) &&
                physical.visible &&
                retrieveReference(victoryEntityReference, EntityType.player) === playerId
            ) generatedPointerAndDefeatCollisionEvents.push(quitMatchEvent(matchId, playerId))
        })
        return generatedPointerAndDefeatCollisionEvents
    }

    private pointerAndDefeatCollisionEvents (playerId: string, defeatEntityReferences: EntityReference[]):GameEvent[] {
        const generatedPointerAndDefeatCollisionEvents:GameEvent[] = []
        defeatEntityReferences.forEach(defeatEntityReference => {
            const matchId = retrieveReference(defeatEntityReference, EntityType.match)
            const physical = this.componentRepository.retrievePhysical(defeatEntityReference.entityId)
            if (!physical) throw new Error(`Missing physical for entity ${defeatEntityReference.entityId}`)
            if (
                this.isPlayerOnMatch(matchId, playerId) &&
                physical.visible &&
                retrieveReference(defeatEntityReference, EntityType.player) === playerId
            ) generatedPointerAndDefeatCollisionEvents.push(quitMatchEvent(matchId, playerId))
        })
        return generatedPointerAndDefeatCollisionEvents
    }

    private pointerAndNextTurnButtonCollisionEvents (playerId: string, nextTurnButtonEntityReferences: EntityReference[]):GameEvent[] {
        const events:GameEvent[] = []
        nextTurnButtonEntityReferences.forEach(nextTurnButtonEntityReference => {
            const matchPhasing = this.componentRepository.retrievePhasing(retrieveReference(nextTurnButtonEntityReference, EntityType.match))
            if (!matchPhasing) throw new Error(`Missing phasing for entity ${nextTurnButtonEntityReference.entityId}`)
            if (retrieveReference(nextTurnButtonEntityReference, EntityType.player) === playerId &&
                matchPhasing.currentPhase.phaseType !== PhaseType.Victory)
                events.push(nextTurnEvent(retrieveReference(nextTurnButtonEntityReference, EntityType.match)))
        })
        return events
    }

    private pointerAndCellAndUnitCollisionEvents (playerId:string, cellEntityReferences: EntityReference[], unitEntityReferences: EntityReference[]): GameEvent[] {
        const generatedPointerAndButtonCollision:GameEvent[] = []
        cellEntityReferences.forEach(cellEntityReference => {
            const girdEntityRef = this.entityReferencesByEntityId(retrieveReference(cellEntityReference, EntityType.grid))
            if (!girdEntityRef) throw new Error(`Missing grid for entity ${cellEntityReference.entityId}`)
            const matchId = retrieveReference(girdEntityRef, EntityType.match)
            if (this.isPlayerOnMatch(matchId, playerId)) {
                const matchPhasingComponent = this.retrieveMatchPhasingComponent(matchId)
                if (matchPhasingComponent.currentPhase.phaseType !== PhaseType.Victory) {
                    const matchEntityReferenceComponent = this.retrieveEntityReferenceComponent(matchId)
                    unitEntityReferences.forEach(unitEntityReference => {
                        if (retrieveReferences(matchEntityReferenceComponent, EntityType.player).includes(retrieveReference(unitEntityReference, EntityType.player)))
                            generatedPointerAndButtonCollision.push(attackEvent(playerId, getCurrentUnitId(matchPhasingComponent), unitEntityReference.entityId))
                    })
                }
            }
        })
        return generatedPointerAndButtonCollision
    }

    private retrieveEntityReferenceComponent (entityId: string) :EntityReference {
        const component = this.componentRepository.retrieveEntityReference(entityId)
        if (!component) throw new Error(`Missing entity reference component for entity ${entityId}`)
        return component
    }

    private pointerAndCellColisionEvents (playerId:string, cellEntityReferences: EntityReference[], towerEntityReferences: EntityReference[], robotEntityReferences: EntityReference[]): GameEvent[] {
        const generatedPointerAndCellColisionEvents:GameEvent[] = []
        if (towerEntityReferences.length > 0 || robotEntityReferences.length > 0) return generatedPointerAndCellColisionEvents
        const supportedMovingEntityType = (entityToMove:string):EntityType => {
            const robotOrTowerEntityType = this.retrieveEntityReferenceComponent(entityToMove).entityType.find(entityType => entityType === EntityType.robot || entityType === EntityType.tower)
            if (robotOrTowerEntityType) return robotOrTowerEntityType
            throw new Error(unsupportedMovingEntity)
        }
        cellEntityReferences.forEach(cellEntityReference => {
            const matchId = retrieveReference(this.retrieveEntityReferenceComponent(retrieveReference(cellEntityReference, EntityType.grid)), EntityType.match)
            if (this.isPlayerOnMatch(matchId, playerId)) {
                const matchPhasingComponent = this.retrieveMatchPhasingComponent(matchId)
                if (matchPhasingComponent.currentPhase.phaseType !== PhaseType.Victory) {
                    const currentUnitToMove = getCurrentUnitId(matchPhasingComponent)
                    generatedPointerAndCellColisionEvents.push(moveEvent(playerId, supportedMovingEntityType(currentUnitToMove), currentUnitToMove, cellEntityReference.entityId))
                }
            }
        })
        return generatedPointerAndCellColisionEvents
    }

    private pointerAndButtonCollisionEvents (playerId:string, buttonEntityReferences: EntityReference[]):GameEvent[] {
        const generatedPointerAndButtonCollision:GameEvent[] = []
        const isSamePlayerButtonAndPointer = (buttonEntityReference:EntityReference, playerId:string):boolean => retrieveReference(buttonEntityReference, EntityType.player) === playerId
        buttonEntityReferences.forEach(buttonEntityReferences => {
            if (isSamePlayerButtonAndPointer(buttonEntityReferences, playerId))
                if (hasReferences(buttonEntityReferences, EntityType.simpleMatchLobby))
                    generatedPointerAndButtonCollision.push(joinSimpleMatchLobby(playerId, retrieveReference(this.retrieveEntityReferenceComponent(playerId), EntityType.mainMenu), retrieveReference(buttonEntityReferences, EntityType.simpleMatchLobby)))
        })
        return generatedPointerAndButtonCollision
    }

    private onCheckCollision (): Promise<void> {
        const physicals = this.componentRepository.retrievePhysicals(undefined).filter((physical):physical is Physical => !!physical)
        const collisionEvents:GameEvent[] = []
        const isMoreThanTwo = (physicalComponents: Physical[]) => physicalComponents.length >= 2
        for (const physicalComponents of this.groupByPositions(physicals).values())
            if (isMoreThanTwo(physicalComponents)) collisionEvents.push(collisionGameEvent(new Map([[EntityType.unknown, physicalComponents.map(physicalComponent => physicalComponent.entityId)]])))
        return this.sendCollisionEvents(collisionEvents)
    }

    private sendCollisionEvents (collisionEvents: GameEvent[]): Promise<void> {
        return Promise.all(collisionEvents.map(event => this.sendEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private groupByPositions (physicalComponents: Physical[]):Map<Position, Physical[]> {
        const uniquePositions = (physicalComponents: Physical[]):Position[] => {
            const isMissingPosition = (physicalComponent: Physical):boolean => !uniquePositions.some(position => isPositionIdentical(physicalComponent.position, position))
            const uniquePositions :Position[] = []
            for (const physicalComponent of physicalComponents) if (isMissingPosition(physicalComponent)) uniquePositions.push(physicalComponent.position)
            return uniquePositions
        }
        const groupByPosition = (physicalComponentsGroupedByPosition:Map<Position, Physical[]>, uniquePosition: Position, physicalComponent:Physical): void => {
            if (isPositionIdentical(physicalComponent.position, uniquePosition)) {
                const physicalComponentsOfUniquePosition = physicalComponentsGroupedByPosition.get(uniquePosition);
                (physicalComponentsOfUniquePosition)
                    ? physicalComponentsOfUniquePosition.push(physicalComponent)
                    : physicalComponentsGroupedByPosition.set(uniquePosition, [physicalComponent])
            }
        }
        const physicalComponentsGroupedByPosition: Map<Position, Physical[]> = new Map()
        uniquePositions(physicalComponents).forEach(uniquePosition =>
            physicalComponents.forEach(physicalComponent =>
                groupByPosition(physicalComponentsGroupedByPosition, uniquePosition, physicalComponent)))
        return physicalComponentsGroupedByPosition
    }

    private retrieveMatchPhasingComponent (matchId: string):Phasing {
        const phasing = this.componentRepository.retrievePhasing(matchId)
        if (!phasing) throw new Error(`Missing phasing component for match ${matchId}`)
        return phasing
    }

    private isPlayerOnMatch (matchId: string, playerId: string): boolean {
        return retrieveReferences(this.retrieveEntityReferenceComponent(matchId), EntityType.player).some(entityId => entityId === playerId)
    }
}
const unsupportedMovingEntity = `Current unit is not '${EntityType.robot}' or '${EntityType.robot}' entity type.`

// const missingEntityReference = (entityType:EntityType, entityReferences:EntityReference[]): string => `Missing '${entityType}' entity reference. List of entity references: ${stringifyWithDetailledSetAndMap(entityReferences)}`
