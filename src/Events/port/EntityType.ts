/* eslint-disable no-unused-vars */
export enum EntityType {
    game = 'Game',
    nobody = 'Nobody',
    mainMenu = 'Main Menu',
    matchMaking = 'Match Making',
    simpleMatchLobby = 'Simple Match Lobby',
    allEntities = 'All Entities',
    match = 'Match',
    tower = 'Tower',
    robot = 'Robot',
    grid = 'Grid',
    player = 'player',
    nothing = 'nothing'
}
export const unsupportedEntityTypeMessage = (entityType:EntityType) => `Entity type ${entityType} is not supported.`
