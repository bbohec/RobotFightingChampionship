import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'
import { Physical, Position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
export const mainMenuShowEvent = (mainMenuId:string, playerId:string, mainMenuPosition:Position) => showEvent(EntityType.mainMenu, mainMenuId, playerId, new Physical(mainMenuId, mainMenuPosition, ShapeType.mainMenu))
export const showEvent = (targetEntityType: EntityType, targetEntityId: string, playerId:string, physicalComponent:Physical) => newGameEvent(Action.show, new Map([
    [targetEntityType, [targetEntityId]],
    [EntityType.player, [playerId]]
]), [physicalComponent])
