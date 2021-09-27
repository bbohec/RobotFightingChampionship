import { Phasing } from '../../../Components/Phasing'
import { Position } from '../../../Components/Physical'
import { EntityType } from '../../../Event/EntityType'
export const cellMissingOnGrid = (position: Position, gridId: string): string => `Cell entity with position '${JSON.stringify(position)}' missing on cell entities of the grid '${gridId}'.`
export const missingInitialPosition = (entityType: EntityType, playerIndex: number): string => `Missing initial position for entity type '${entityType}' of player '${playerIndex}'`
export const missingDefeatPlayerId = 'defeatPlayerId missing on playable components'
export const currentPhaseNotSupported = (matchPhasingComponent: Phasing): string => `Current phase '${matchPhasingComponent.currentPhase}' not supported for next turn.`
export const missingPlayerInderOnPlayableComponent = (playerIndex: number): string => `Player Index '${playerIndex}' missing on Playable component.`
export const victoryPlayerMissingOnPlayableComponent = (victoryPlayerId: string): string => `Victory playerId '${victoryPlayerId}' missing on Playable compoenent.`
export const unitMissingOnPlayerTowersAndRobots = (currentUnitId: string): string => `Unit with id ${currentUnitId} not found on player's towers and robots`
