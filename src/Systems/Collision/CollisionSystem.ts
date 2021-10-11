import { EntityReference } from '../../Components/EntityReference'
import { Phasing } from '../../Components/Phasing'
import { Physical, Position } from '../../Components/Physical'
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

    private onCollision (gameEvent: GameEvent): Promise<void> {
        const entityReferenceWithEntityType = (entityReferenceComponents: EntityReference[], entityType:EntityType):EntityReference | undefined => entityReferenceComponents.find(entityReference => entityReference.entityType.some(entityReferenceEntityType => entityReferenceEntityType === entityType))
        const collisionnedEntityReferenceComponents = gameEvent.entitiesByEntityType(EntityType.unknown).map(entityId => this.interactWithEntities.retrieveEntityComponentByEntityId(entityId, EntityReference))
        const pointerEntityReference = entityReferenceWithEntityType(collisionnedEntityReferenceComponents, EntityType.pointer)
        return (pointerEntityReference)
            ? this.onPointerCollision(
                pointerEntityReference.retreiveReference(EntityType.player),
                entityReferenceWithEntityType(collisionnedEntityReferenceComponents, EntityType.button),
                entityReferenceWithEntityType(collisionnedEntityReferenceComponents, EntityType.cell),
                entityReferenceWithEntityType(collisionnedEntityReferenceComponents, EntityType.tower),
                entityReferenceWithEntityType(collisionnedEntityReferenceComponents, EntityType.robot)
            )
            : Promise.reject(new Error(missingEntityReference(EntityType.pointer)))
    }

    private onPointerCollision (playerId:string, buttonEntityReference: EntityReference | undefined, cellEntityReference: EntityReference | undefined, towerEntityReference: EntityReference | undefined, robotEntityReference: EntityReference | undefined) {
        return buttonEntityReference
            ? this.onPointerAndButtonCollision(playerId, buttonEntityReference)
            : cellEntityReference && towerEntityReference
                ? this.onCellAndPointerAndUnitCollision(playerId, cellEntityReference, towerEntityReference)
                : cellEntityReference && robotEntityReference
                    ? this.onCellAndPointerAndUnitCollision(playerId, cellEntityReference, robotEntityReference)
                    : cellEntityReference
                        ? this.onCellAndPointerCollision(playerId, cellEntityReference)
                        : Promise.resolve()
    }

    private onCellAndPointerAndUnitCollision (playerId:string, cellEntityReference: EntityReference, unitEntityReference: EntityReference): Promise<void> {
        const matchId = this.entityReferencesByEntityId(cellEntityReference.retreiveReference(EntityType.grid)).retreiveReference(EntityType.match)
        return (this.isPlayerOnMatch(matchId, playerId))
            ? this.sendEvent(attackEvent(playerId, this.currentPhaseUnit(matchId), unitEntityReference.entityId))
            : Promise.resolve()
    }

    private onCellAndPointerCollision (playerId:string, cellEntityReference: EntityReference): Promise<void> {
        const supportedMovingEntityType = (entityToMove:string):EntityType => {
            const robotOrTowerEntityType = this.entityReferencesByEntityId(entityToMove).entityType.find(entityType => entityType === EntityType.robot || entityType === EntityType.tower)
            if (robotOrTowerEntityType) return robotOrTowerEntityType
            throw new Error(unsupportedMovingEntity)
        }
        const matchId = this.entityReferencesByEntityId(cellEntityReference.retreiveReference(EntityType.grid)).retreiveReference(EntityType.match)
        const currentUnitToMove = this.currentPhaseUnit(matchId)
        return (this.isPlayerOnMatch(matchId, playerId))
            ? this.sendEvent(moveEvent(playerId, supportedMovingEntityType(currentUnitToMove), currentUnitToMove, cellEntityReference.entityId))
            : Promise.resolve()
    }

    private onPointerAndButtonCollision (playerId:string, buttonEntityReference: EntityReference): Promise<void> {
        const isSamePlayerButtonAndPointer = (buttonEntityReference:EntityReference, playerId:string):boolean => buttonEntityReference.retreiveReference(EntityType.player) === playerId
        if (isSamePlayerButtonAndPointer(buttonEntityReference, playerId))
            return (buttonEntityReference.hasReferences(EntityType.simpleMatchLobby))
                ? this.sendEvent(joinSimpleMatchLobby(playerId, this.entityReferencesByEntityId(playerId).retreiveReference(EntityType.mainMenu), buttonEntityReference.retreiveReference(EntityType.simpleMatchLobby)))
                : (buttonEntityReference.hasReferences(EntityType.match))
                    ? this.sendEvent(nextTurnEvent(buttonEntityReference.retreiveReference(EntityType.match)))
                    : Promise.resolve()
        return Promise.resolve()
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
const missingEntityReference = (entityType:EntityType): string => `Missing '${entityType}' entity reference.`
