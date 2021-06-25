import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { newEvent } from '../../Events/port/GameEvents'

/*
Feature : Player
    Scenario: Player join simple match
        Given a player "Player A"
        When the player join a simple match
        Then the event "'Player A' want to join a simple match" is sent to the Client Game

*/
const playerId = 'Player A'
const towerId = 'Tower'
const registerTowerOnPlayerEvent = newEvent(Action.register, EntityType.player, playerId, towerId)
