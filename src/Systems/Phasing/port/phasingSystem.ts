import { Phasing } from '../../../Components/Phasing'
import { Position } from '../../../Components/Physical'
import { MatchPlayer } from '../../../Components/port/Phase'
import { EntityType } from '../../../Event/EntityType'
export const cellMissingOnGrid = (position: Position, gridId: string): string => `Cell entity with position '${JSON.stringify(position)}' missing on cell entities of the grid '${gridId}'.`
export const missingInitialPosition = (entityType: EntityType, matchPlayer: MatchPlayer): string => `Missing initial position for entity type '${entityType}' and matchPlayer '${matchPlayer}'`
export const missingDefeatPlayerId = 'defeatPlayerId missing on playable components'
export const currentPhaseNotSupported = (matchPhasingComponent: Phasing): string => `Current phase '${matchPhasingComponent.currentPhase}' not supported for next turn.`
