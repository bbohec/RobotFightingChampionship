import { Controller } from '../../Components/Controller'
import { EntityReference } from '../../Components/EntityReference'
import { Phasing } from '../../Components/Phasing'
import { Physical, Position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { attackEvent } from '../../Events/attack/attack'
import { collisionGameEvent } from '../../Events/collision/collision'
import { joinSimpleMatchLobby } from '../../Events/join/join'
import { moveEvent } from '../../Events/move/move'
import { nextTurnEvent } from '../../Events/nextTurn/nextTurn'
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
        const collisionnedEntityReferenceComponents = gameEvent.entitiesByEntityType(EntityType.unknown).map(entityId => this.interactWithEntities.retrieveEntityComponentByEntityId(entityId, EntityReference))
        const pointerEntityReference = this.entityReferencesWithEntityType(collisionnedEntityReferenceComponents, EntityType.pointer)
        const pointerCollisionGeneratedEvents:GameEvent[] = []
        pointerEntityReference.forEach(pointerEntityReference => pointerCollisionGeneratedEvents.push(...this.onPointerCollisionEvents(
            pointerEntityReference.retreiveReference(EntityType.player),
            this.interactWithEntities.retrieveEntityComponentByEntityId(pointerEntityReference.entityId, Controller),
            collisionnedEntityReferenceComponents
        )))
        return Promise.all(pointerCollisionGeneratedEvents.map(gameEvent => this.sendEvent(gameEvent)))
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
            generatedPointerCollisionEvents.push(...this.pointerAndCellAndUnitCollisionEvents(playerId, cellEntityReferences, towerEntityReferences))
            generatedPointerCollisionEvents.push(...this.pointerAndCellAndUnitCollisionEvents(playerId, cellEntityReferences, robotEntityReferences))
            generatedPointerCollisionEvents.push(...this.pointerAndCellColisionEvents(playerId, cellEntityReferences, towerEntityReferences, robotEntityReferences))
        }
        return generatedPointerCollisionEvents
    }

    private pointerAndCellAndUnitCollisionEvents (playerId:string, cellEntityReferences: EntityReference[], unitEntityReferences: EntityReference[]): GameEvent[] {
        const generatedPointerAndButtonCollision:GameEvent[] = []
        cellEntityReferences.forEach(cellEntityReference => {
            const matchId = this.entityReferencesByEntityId(cellEntityReference.retreiveReference(EntityType.grid)).retreiveReference(EntityType.match)
            if (this.isPlayerOnMatch(matchId, playerId))
                unitEntityReferences.forEach(unitEntityReference => generatedPointerAndButtonCollision.push(attackEvent(playerId, this.currentPhaseUnit(matchId), unitEntityReference.entityId)))
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
            const matchId = this.entityReferencesByEntityId(cellEntityReference.retreiveReference(EntityType.grid)).retreiveReference(EntityType.match)
            const currentUnitToMove = this.currentPhaseUnit(matchId)
            if (this.isPlayerOnMatch(matchId, playerId)) generatedPointerAndCellColisionEvents.push(moveEvent(playerId, supportedMovingEntityType(currentUnitToMove), currentUnitToMove, cellEntityReference.entityId))
        })
        return generatedPointerAndCellColisionEvents
    }

    private pointerAndButtonCollisionEvents (playerId:string, buttonEntityReferences: EntityReference[]):GameEvent[] {
        const generatedPointerAndButtonCollision:GameEvent[] = []
        const isSamePlayerButtonAndPointer = (buttonEntityReference:EntityReference, playerId:string):boolean => buttonEntityReference.retreiveReference(EntityType.player) === playerId
        buttonEntityReferences.forEach(buttonEntityReferences => {
            if (isSamePlayerButtonAndPointer(buttonEntityReferences, playerId)) {
                if (buttonEntityReferences.hasReferences(EntityType.simpleMatchLobby))
                    generatedPointerAndButtonCollision.push(joinSimpleMatchLobby(playerId, this.entityReferencesByEntityId(playerId).retreiveReference(EntityType.mainMenu), buttonEntityReferences.retreiveReference(EntityType.simpleMatchLobby)))
                if (buttonEntityReferences.hasReferences(EntityType.match))
                    generatedPointerAndButtonCollision.push(nextTurnEvent(buttonEntityReferences.retreiveReference(EntityType.match)))
            }
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

    private currentPhaseUnit (matchId: string) {
        return this.interactWithEntities.retrieveEntityComponentByEntityId(matchId, Phasing).getCurrentUnitId()
    }

    private isPlayerOnMatch (matchId: string, playerId: string): boolean {
        return this.entityReferencesByEntityId(matchId).retrieveReferences(EntityType.player).some(entityId => entityId === playerId)
    }
}
const unsupportedMovingEntity = `Current unit is not '${EntityType.robot}' or '${EntityType.robot}' entity type.`
// const missingEntityReference = (entityType:EntityType, entityReferences:EntityReference[]): string => `Missing '${entityType}' entity reference. List of entity references: ${stringifyWithDetailledSetAndMap(entityReferences)}`
