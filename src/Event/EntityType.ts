/* eslint-disable no-unused-vars */
export enum EntityType {
    game = 'Game',
    nobody = 'Nobody',
    mainMenu = 'Main Menu',
    simpleMatchLobby = 'Simple Match Lobby',
    allEntities = 'All Entities',
    match = 'Match',
    tower = 'Tower',
    robot = 'Robot',
    grid = 'Grid',
    player = 'player',
    nothing = 'nothing',
    attacker = 'attacker',
    hittable = 'hittable',
    victory = 'victory',
    defeat = 'defeat',
    cell = 'cell',
    target = 'target',
    message = 'message',
    unknown = 'unknown',
    button = 'button',
    pointer = 'pointer',
    simpleMatchLobbyMenu = 'simpleMatchLobbyMenu',
    nextTurnButton = 'nextTurnButton'
}
export const unsupportedEntityTypeMessage = (entityType:EntityType) => `Entity type ${entityType} is not supported.`
