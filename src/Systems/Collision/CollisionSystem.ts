import { Controller } from '../../Components/Controller'
import { EntityReference } from '../../Components/EntityReference'
import { Phasing } from '../../Components/Phasing'
import { Physical, Position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { PhaseType } from '../../Components/port/Phase'
import { missingEntityId } from '../../Entities/infra/InMemoryEntityRepository'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { attackEvent } from '../../Events/attack/attack'
import { collisionGameEvent } from '../../Events/collision/collision'
import { joinSimpleMatchLobby } from '../../Events/join/join'
import { moveEvent } from '../../Events/move/move'
import { nextTurnEvent } from '../../Events/nextTurn/nextTurn'
import { notifyServerEvent } from '../../Events/notifyServer/notifyServer'
import { quitMatchEvent } from '../../Events/quit/quit'
import { GenericServerSystem } from '../Generic/GenericServerSystem'

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
        const entities = gameEvent.entitiesByEntityType(EntityType.unknown)
        const missingEntities = entities.filter(entity => !this.interactWithEntities.isEntityExist(entity))
        const existingEntities = entities.filter(entity => this.interactWithEntities.isEntityExist(entity))
        const collisionnedEntityReferenceComponents = existingEntities.map(entityId => this.interactWithEntities.retrieveEntityComponentByEntityId(entityId, EntityReference))
        const pointerEntityReference = this.entityReferencesWithEntityType(collisionnedEntityReferenceComponents, EntityType.pointer)
        const pointerCollisionGeneratedEvents:GameEvent[] = []
        pointerEntityReference.forEach(pointerEntityReference => pointerCollisionGeneratedEvents.push(...this.onPointerCollisionEvents(
            pointerEntityReference.retrieveReference(EntityType.player),
            this.interactWithEntities.retrieveEntityComponentByEntityId(pointerEntityReference.entityId, Controller),
            collisionnedEntityReferenceComponents
        )))
        return Promise.all([
            ...pointerCollisionGeneratedEvents.map(gameEvent => this.sendEvent(gameEvent)),
            ...missingEntities.map(missingEntity => this.sendEvent(notifyServerEvent(missingEntityId(missingEntity))))
        ])
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private onPointerCollisionEvents (playerId:string, pointerController:Controller, collisionnedEntityReferenceComponents:EntityReference[]):GameEvent[] {
        const generatedPointerCollisionEvents:GameEvent[] = []
        if (pointerController.primaryButton === ControlStatus.Active) {
            pointerController.primaryButton = ControlStatus.Idle
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
            const matchId = victoryEntityReference.retrieveReference(EntityType.match)
            if (
                this.isPlayerOnMatch(matchId, playerId) &&
                this.interactWithEntities.retrieveEntityComponentByEntityId(victoryEntityReference.entityId, Physical).visible &&
                victoryEntityReference.retrieveReference(EntityType.player) === playerId
            ) generatedPointerAndDefeatCollisionEvents.push(quitMatchEvent(matchId, playerId))
        })
        return generatedPointerAndDefeatCollisionEvents
    }

    private pointerAndDefeatCollisionEvents (playerId: string, defeatEntityReferences: EntityReference[]):GameEvent[] {
        const generatedPointerAndDefeatCollisionEvents:GameEvent[] = []
        defeatEntityReferences.forEach(defeatEntityReference => {
            const matchId = defeatEntityReference.retrieveReference(EntityType.match)
            if (
                this.isPlayerOnMatch(matchId, playerId) &&
                this.interactWithEntities.retrieveEntityComponentByEntityId(defeatEntityReference.entityId, Physical).visible &&
                defeatEntityReference.retrieveReference(EntityType.player) === playerId
            ) generatedPointerAndDefeatCollisionEvents.push(quitMatchEvent(matchId, playerId))
        })
        return generatedPointerAndDefeatCollisionEvents
    }

    private pointerAndNextTurnButtonCollisionEvents (playerId: string, nextTurnButtonEntityReferences: EntityReference[]):GameEvent[] {
        const events:GameEvent[] = []
        nextTurnButtonEntityReferences.forEach(nextTurnButtonEntityReference => {
            if (nextTurnButtonEntityReference.retrieveReference(EntityType.player) === playerId &&
                this.interactWithEntities.retrieveEntityComponentByEntityId(nextTurnButtonEntityReference.retrieveReference(EntityType.match), Phasing).currentPhase.phaseType !== PhaseType.Victory)
                events.push(nextTurnEvent(nextTurnButtonEntityReference.retrieveReference(EntityType.match)))
        })
        return events
    }

    private pointerAndCellAndUnitCollisionEvents (playerId:string, cellEntityReferences: EntityReference[], unitEntityReferences: EntityReference[]): GameEvent[] {
        const generatedPointerAndButtonCollision:GameEvent[] = []
        cellEntityReferences.forEach(cellEntityReference => {
            const matchId = this.entityReferencesByEntityId(cellEntityReference.retrieveReference(EntityType.grid)).retrieveReference(EntityType.match)
            if (this.isPlayerOnMatch(matchId, playerId)) {
                const matchPhasingComponent = this.retrieveMatchPhasingComponent(matchId)
                if (matchPhasingComponent.currentPhase.phaseType !== PhaseType.Victory)
                    unitEntityReferences.forEach(unitEntityReference => generatedPointerAndButtonCollision.push(attackEvent(playerId, matchPhasingComponent.getCurrentUnitId(), unitEntityReference.entityId)))
            }
        })
        return generatedPointerAndButtonCollision
    }

    private pointerAndCellColisionEvents (playerId:string, cellEntityReferences: EntityReference[], towerEntityReferences: EntityReference[], robotEntityReferences: EntityReference[]): GameEvent[] {
        const generatedPointerAndCellColisionEvents:GameEvent[] = []
        if (towerEntityReferences.length > 0 || robotEntityReferences.length > 0) return generatedPointerAndCellColisionEvents
        const supportedMovingEntityType = (entityToMove:string):EntityType => {
            const robotOrTowerEntityType = this.entityReferencesByEntityId(entityToMove).entityType.find(entityType => entityType === EntityType.robot || entityType === EntityType.tower)
            if (robotOrTowerEntityType) return robotOrTowerEntityType
            throw new Error(unsupportedMovingEntity)
        }
        cellEntityReferences.forEach(cellEntityReference => {
            const matchId = this.entityReferencesByEntityId(cellEntityReference.retrieveReference(EntityType.grid)).retrieveReference(EntityType.match)
            if (this.isPlayerOnMatch(matchId, playerId)) {
                const matchPhasingComponent = this.retrieveMatchPhasingComponent(matchId)
                if (matchPhasingComponent.currentPhase.phaseType !== PhaseType.Victory) {
                    const currentUnitToMove = matchPhasingComponent.getCurrentUnitId()
                    generatedPointerAndCellColisionEvents.push(moveEvent(playerId, supportedMovingEntityType(currentUnitToMove), currentUnitToMove, cellEntityReference.entityId))
                }
            }
        })
        return generatedPointerAndCellColisionEvents
    }

    private pointerAndButtonCollisionEvents (playerId:string, buttonEntityReferences: EntityReference[]):GameEvent[] {
        const generatedPointerAndButtonCollision:GameEvent[] = []
        const isSamePlayerButtonAndPointer = (buttonEntityReference:EntityReference, playerId:string):boolean => buttonEntityReference.retrieveReference(EntityType.player) === playerId
        buttonEntityReferences.forEach(buttonEntityReferences => {
            if (isSamePlayerButtonAndPointer(buttonEntityReferences, playerId))
                if (buttonEntityReferences.hasReferences(EntityType.simpleMatchLobby))
                    generatedPointerAndButtonCollision.push(joinSimpleMatchLobby(playerId, this.entityReferencesByEntityId(playerId).retrieveReference(EntityType.mainMenu), buttonEntityReferences.retrieveReference(EntityType.simpleMatchLobby)))
        })
        return generatedPointerAndButtonCollision
    }

    private onCheckCollision (): Promise<void> {
        const entitiesPhysicalComponents = this.interactWithEntities.retrieveEntitiesThatHaveComponent(Physical).map(entity => entity.retrieveComponent(Physical))
        const collisionEvents:GameEvent[] = []
        const isMoreThanTwo = (physicalComponents: Physical[]) => physicalComponents.length >= 2
        for (const physicalComponents of this.groupByPositions(entitiesPhysicalComponents).values())
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
            const isMissingPosition = (physicalComponent: Physical):boolean => !uniquePositions.some(position => physicalComponent.isPositionIdentical(position))
            const uniquePositions :Position[] = []
            for (const physicalComponent of physicalComponents) if (isMissingPosition(physicalComponent)) uniquePositions.push(physicalComponent.position)
            return uniquePositions
        }
        const groupByPosition = (physicalComponentsGroupedByPosition:Map<Position, Physical[]>, uniquePosition: Position, physicalComponent:Physical): void => {
            if (physicalComponent.isPositionIdentical(uniquePosition)) {
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

    private retrieveMatchPhasingComponent (matchId: string) {
        return this.interactWithEntities.retrieveEntityComponentByEntityId(matchId, Phasing)
    }

    private isPlayerOnMatch (matchId: string, playerId: string): boolean {
        return this.entityReferencesByEntityId(matchId).retrieveReferences(EntityType.player).some(entityId => entityId === playerId)
    }
}
const unsupportedMovingEntity = `Current unit is not '${EntityType.robot}' or '${EntityType.robot}' entity type.`

// const missingEntityReference = (entityType:EntityType, entityReferences:EntityReference[]): string => `Missing '${entityType}' entity reference. List of entity references: ${stringifyWithDetailledSetAndMap(entityReferences)}`
