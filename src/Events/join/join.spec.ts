
import { Playable } from '../../Components/Playable'
import { showEvent } from '../show/show'
import { hideEvent } from '../hide/hide'
import { createGridEvent, createMatchEvent, createRobotEvent, createTowerEvent } from '../create/create'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, feature, featureEventDescription, serverScenario, theEntityIsCreated, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { joinSimpleMatchLobby, joinSimpleMatchServerEvent, playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from './join'
import { EntityReference } from '../../Components/EntityReference'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId, players } from '../../Event/entityIds'
feature(featureEventDescription(Action.join), () => {
    clientScenario(`${Action.join} 1`, joinSimpleMatchLobby(EntityId.playerA, EntityId.mainMenu, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).save()
            .buildEntity(EntityId.game).withLifeCycle(true).save()
            .buildEntity(EntityId.mainMenu).save()
            .buildEntity(EntityId.simpleMatchLobby).save()
        , [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityId.game),
            (game, adapters) => whenEventOccurs(game, joinSimpleMatchLobby(EntityId.playerA, EntityId.mainMenu, EntityId.simpleMatchLobby)),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, joinSimpleMatchServerEvent(EntityId.playerA, EntityId.simpleMatchLobby)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hideEvent(EntityType.mainMenu, EntityId.mainMenu)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.matchMaking, EntityId.simpleMatchLobby, EntityId.playerA))
        ]
    )
    serverScenario(`${Action.join} 2`, playerJoinMatchEvent(EntityId.playerA, EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Playable, new Playable(EntityId.match, [])),
            (game, adapters) => whenEventOccurs(game, playerJoinMatchEvent(EntityId.playerA, EntityId.match)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA])),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.match, [EntityId.match]]])))
        ])
    serverScenario(`${Action.join} 3`, playerJoinMatchEvent(EntityId.playerB, EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA])),
            (game, adapters) => whenEventOccurs(game, playerJoinMatchEvent(EntityId.playerB, EntityId.match)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA, EntityId.playerB])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createTowerEvent(EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createRobotEvent(EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createTowerEvent(EntityId.playerB)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createRobotEvent(EntityId.playerB)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createGridEvent(EntityId.match))
        ])
    serverScenario(`${Action.join} 4`, playerWantJoinSimpleMatchLobby(EntityId.playerA, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withPlayers([]).withLifeCycle(true).save()
        , [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityId.simpleMatchLobby),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(EntityId.playerA, EntityId.simpleMatchLobby)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, [EntityId.playerA]))
        ])
    serverScenario(`${Action.join} 5`, players.map(player => playerWantJoinSimpleMatchLobby(player, EntityId.simpleMatchLobby)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withPlayers([]).withLifeCycle(true).save()
        , [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityId.simpleMatchLobby),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[0], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[1], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[2], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[3], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[4], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[5], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[6], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[7], EntityId.simpleMatchLobby)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, players)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createMatchEvent(EntityId.simpleMatchLobby), players.length / 2 - (players.length % 2 / 2))
        ])
})
