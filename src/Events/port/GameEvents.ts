import { EventDestination, GameEvent } from './GameEvent'
export const MatchMakingShowEvent:GameEvent = { message: 'Show', destination: 'Match Making', sourceRef: '' }
export const MainMenuHide:GameEvent = { message: 'Hide', destination: 'Main Menu', sourceRef: '' }
export const MainMenuShow:GameEvent = { message: 'Show', destination: 'Main Menu', sourceRef: '' }
export const simpleMatchLobbyShow:GameEvent = { message: 'Show', destination: 'Simple Match Lobby', sourceRef: '' }

// export const SimpleMatchLobbyPlayerWantJoinSimpleMatch = (player:string):GameEvent => ({ message: 'Want to join a simple match', destination: 'Simple Match Lobby', sourceRef: player })
export const PlayerWantJoinSimpleMatch = (player:string, destination:EventDestination):GameEvent => ({ message: 'Want to join.', destination: destination, sourceRef: player })
export const newLoopEvent:GameEvent = { message: 'New Loop', destination: 'All Entities', sourceRef: '' }
export const MatchWaitingForPlayers = (matchId:string):GameEvent => ({ message: 'Waiting for players', destination: 'Simple Match Lobby', sourceRef: matchId })
export const playerJoinMatch = (player:string, matchId:string): GameEvent => ({ message: 'Player join match', sourceRef: player, destination: 'Match', destinationId: matchId })
export const createMainMenuEvent :GameEvent = { message: 'Create', sourceRef: '', destination: 'Main Menu' }
export const createClientGameEvent :GameEvent = { message: 'Create', sourceRef: '', destination: 'Client Game' }
export const createServerGameEvent :GameEvent = { message: 'Create', sourceRef: '', destination: 'Server Game' }
// export const createMatchMakingGameEvent :GameEvent = { message: 'Create', sourceRef: '', destination: 'Match Making' }
export const createSimpleMatchLobbyEvent :GameEvent = { message: 'Create', sourceRef: '', destination: 'Simple Match Lobby' }
export const createMatchEvent :GameEvent = { message: 'Create', sourceRef: '', destination: 'Match' }

export const errorMessageOnUnknownEventAction = (systemName:string, gameEvent: GameEvent) => `${systemName} don't know what to do with game Event message '${gameEvent.message}' and destination '${gameEvent.destination}'.`
