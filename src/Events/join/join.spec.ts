
import { Playable } from '../../Components/Playable'
import { showEvent } from '../show/show'
import { hideEvent } from '../hide/hide'
import { createGridEvent, createMatchEvent, createRobotEvent, createTowerEvent } from '../create/create'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityIsCreated, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from './join'
import { EntityReference } from '../../Components/EntityReference'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId, players } from '../../Event/entityIds'
import { Physical, simpleMatchLobbyPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'

feature(featureEventDescription(Action.join), () => {
    serverScenario(`${Action.join} 1`, playerJoinMatchEvent(EntityId.playerA, EntityId.match),
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
    serverScenario(`${Action.join} 2`, playerJoinMatchEvent(EntityId.playerB, EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA])),
            (game, adapters) => whenEventOccurs(game, playerJoinMatchEvent(EntityId.playerB, EntityId.match)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA, EntityId.playerB])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createTowerEvent(EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createRobotEvent(EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createTowerEvent(EntityId.playerB)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createRobotEvent(EntityId.playerB)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createGridEvent(EntityId.match))
        ])
    serverScenario(`${Action.join} 3`, playerWantJoinSimpleMatchLobby(EntityId.playerA, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withPlayers([]).withLifeCycle(true).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobby).save()
        , [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityId.simpleMatchLobby),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Physical, new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(EntityId.playerA, EntityId.simpleMatchLobby)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, [EntityId.playerA])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.simpleMatchLobby, EntityId.simpleMatchLobby, players[0], new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby)))
        ])
    serverScenario(`${Action.join} 4`, players.map(player => playerWantJoinSimpleMatchLobby(player, EntityId.simpleMatchLobby)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withPlayers([]).withLifeCycle(true).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobby).save()
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
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createMatchEvent(EntityId.simpleMatchLobby), players.length / 2 - (players.length % 2 / 2)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.mainMenu, players[0])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.mainMenu, players[1])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.mainMenu, players[2])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.mainMenu, players[3])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.mainMenu, players[4])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.mainMenu, players[5])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.mainMenu, players[6])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.mainMenu, players[7])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.simpleMatchLobby, EntityId.simpleMatchLobby, players[0], new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.simpleMatchLobby, EntityId.simpleMatchLobby, players[1], new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.simpleMatchLobby, EntityId.simpleMatchLobby, players[2], new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.simpleMatchLobby, EntityId.simpleMatchLobby, players[3], new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.simpleMatchLobby, EntityId.simpleMatchLobby, players[4], new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.simpleMatchLobby, EntityId.simpleMatchLobby, players[5], new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.simpleMatchLobby, EntityId.simpleMatchLobby, players[6], new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.simpleMatchLobby, EntityId.simpleMatchLobby, players[7], new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby)))
        ])
})
