import { EntityReference, EntityReferences } from './core/ecs/components/EntityReference'
import { Component, ComponentType } from './core/ecs/component'
import { Action } from './core/type/Action'
import { EntityType } from './core/type/EntityType'
import { GameEvent } from './core/type/GameEvent'
import { Phase } from './core/type/Phase'
import { Phasing } from './core/ecs/components/Phasing'
import { Position } from './core/ecs/components/Physical'
import { TestStep } from './test/TestStep'
import { EntityComponents } from './core/ecs/entity'

export const gameEventNotFoundOnEventInteractor = (expectedEvent: GameEvent, existingEvents: GameEvent[], to:'client'|'server'): string =>
    `The following game event is not found on '${to}' event repository:\n${stringifyWithDetailledSetAndMap(expectedEvent)}
    List of current ${to} events:\n${existingEvents.map(event => stringifyWithDetailledSetAndMap(event)).join('\n')}`
export function missingCurrentUnitIdOnPhase (currentPhase: Phase): string {
    return `Missing currentUnitId on phase ${currentPhase.phaseType}.`
}
export const componentIsNot = (component: Component, componentType:ComponentType): string => `${component} is not ${componentType}.`

export const missingEntityReferenceByEntityType = (entityRefType: EntityType, entityReference:EntityReference): string => `There is not entity type '${entityRefType}' on entity references component of entity '${entityReference.entityType}' with id '${entityReference.entityId}'.`
export const multipleEntitiesReferencedByEntityType = (referenceEntityType: EntityType, entityReference: EntityReference, references:string []): string => `There is multiples '${referenceEntityType}' references for entity type on entity references component of the '${entityReference.entityType}' entity '${entityReference.entityId}' : ${references}`
export const noEntityTypeOnEntityReference = (entityId: string, entityType:EntityType[]): string => `There is no entity type for the '${entityType}' entity '${entityId}'.`
export const multipleEntityTypeOnEntityReference = (entityId: string, entityTypes:EntityType[]): string => `There is multiple entity types for entity '${entityId}' : ${entityTypes}`
export const componentMissingOnEntity = (id: string, components: EntityComponents): string => `Component missing on entity id '${id}'. Available components: \n${stringifyWithDetailledSetAndMap(components)}`
export const entityAlreadyBuild = (components:Component[]) => `Entity already on builder with components:
    ${components.map(component => stringifyWithDetailledSetAndMap(sorted(component))).join('\n    ')}
Forget save()?`
export const noEntitiesReferenced = (entityType: EntityType, action: Action, entityReferences: EntityReferences): string => `No entities referenced with type '${entityType}' on event with action '${action}'.\n Actual references: ${stringifyWithDetailledSetAndMap(entityReferences)}`
export const noEntityReferenced = (entityType: EntityType): string => `No '${entityType}' entities is not supported.`
export const multipleEntityReferenced = (entityType: EntityType): string => `Multiple '${entityType}' entities referenced.`
export const featureEventDescription = (action:Action): string => `Feature : ${action} events`

export const hasComponents = (testStep: TestStep, expectedComponents: Component[]): string => `${testStep} there is components :
        ${expectedComponents.map(component => stringifyWithDetailledSetAndMap(component)).join('\n\t')}`

export const detailedComparisonMessage = (thing:unknown, expectedThing:unknown):string => `DETAILS\nexpected >>>>>>>> ${stringifyWithDetailledSetAndMap(thing)} \nto deeply equal > ${stringifyWithDetailledSetAndMap(expectedThing)} \n`

export const eventMessage = (event:GameEvent): string => `When the event action '${event.action}' occurs with entity references '${stringifyWithDetailledSetAndMap(event.entityRefences)}'.`
export const eventsAreSentMessage = (testStep: TestStep, gameEvents: GameEvent[], to:'server'|string): string =>
    (gameEvents.length === 0)
        ? `${testStep} no events are sent to '${to}.`
        : `${testStep} following events are sent to '${to}' :
        ${gameEvents.map(gameEvent => stringifyWithDetailledSetAndMap(gameEvent)).join('\n\t')}'`

export const thereIsANotificationMessage = (testStep: TestStep, notification: string): string => `${testStep} there is a notification : '${notification}'`

export const entityIsNotVisibleMessage = (testStep: TestStep, expectedComponents: Component[]): string => `${testStep} the following entities are visible:
        ${expectedComponents.map(component => stringifyWithDetailledSetAndMap(component)).join('\n\t')}`

export const theControllerAdapterIsInteractiveMessage = (testStep: TestStep): string => `${testStep} the controller adapter is interactive.`
export const theControllerAdapterIsNotInteractiveMessage = (testStep: TestStep): string => `${testStep} the controller adapter is not interactive.`

export const eventDetailedComparisonMessage = (gameEvents: GameEvent[], expectedGameEvents: GameEvent[]): string => `DETAILS
    expected >>> ${stringifyWithDetailledSetAndMap(expectedGameEvents)}
    actual >>>>> ${stringifyWithDetailledSetAndMap(gameEvents)} \n`

export const componentDetailedComparisonMessage = (components: Component[], expectedComponents: Component[]): string => `DETAILS
expected >>\n\t${expectedComponents.map(component => stringifyWithDetailledSetAndMap(sorted(component))).join('\n\t')}}
actual >>>>\n\t${components.map(component => stringifyWithDetailledSetAndMap(sorted(component))).join('\n\t')}\n`

const sorted = (component:Component):any => Object.fromEntries(Object.entries(component).sort((a, b) => a[0] > b[0] ? 1 : -1))

export const stringifyWithDetailledSetAndMap = (value:any):string => JSON.stringify(value, detailledStringifyForSetAndMap)
export const detailledStringifyForSetAndMap = (key: string, value: any): any =>
    (value instanceof Set)
        ? [...value.values()]
        : (value instanceof Map)
            ? mapToObjectLiteral(value)
            : value
export const mapToObjectLiteral = (value: Map<any, any>): Record<string, any> => Array.from(value).reduce((obj: Record<string, any>, [key, value]) => {
    obj[key] = value
    return obj
}, {})

export const cellMissingOnGrid = (position: Position, gridId: string): string => `Cell entity with position '${JSON.stringify(position)}' missing on cell entities of the grid '${gridId}'.`
export const missingInitialPosition = (entityType: EntityType, playerIndex: number): string => `Missing initial position for entity type '${entityType}' of player '${playerIndex}'`
export const missingDefeatPlayerId = 'defeatPlayerId missing on playable components'
export const currentPhaseNotSupported = (matchPhasingComponent: Phasing): string => `Current phase '${matchPhasingComponent.currentPhase}' not supported for next turn.`
export const missingPlayerInderOnPlayableComponent = (playerIndex: number): string => `Player Index '${playerIndex}' missing on Playable component.`
export const victoryPlayerMissingOnPlayableComponent = (victoryPlayerId: string): string => `Victory playerId '${victoryPlayerId}' missing on Playable compoenent.`
export const unitMissingOnPlayerTowersAndRobots = (currentUnitId: string): string => `Unit with id ${currentUnitId} not found on player's towers and robots`

export const playerNotFoundOnMatchPlayers = (playerId: string): string => `Player with Id '${playerId}' not found on match players.`
export const noMatchWithPlayerOnPlayableComponent = (playerId: string): string => `No match with player that have id ${playerId} on Playable component.`
