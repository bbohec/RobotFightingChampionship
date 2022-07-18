
import { makePhasing, preparingGamePhase } from '../../Components/Phasing'
import { makePhysical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, whenEventOccured, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroySimpleMatchLobbyMenuEvent } from '../destroy/destroy'
import { drawEvent } from '../draw/draw'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { playerReadyForMatch } from './ready'
feature(featureEventDescription(Action.ready), () => {
    serverScenario(`${Action.ready} 1`, playerReadyForMatch(EntityId.match, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(preparingGamePhase).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityId.playerASimpleMatchLobbyMenu]]])).save()
            .buildEntity(EntityId.playerASimpleMatchLobbyMenu).withPhysicalComponent(position(0, 0), ShapeType.simpleMatchLobbyMenu, true).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, makePhasing(EntityId.match, preparingGamePhase)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, makePhasing(EntityId.match, preparingGamePhase, new Set([EntityId.playerA]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityId.playerA, makePhysical(EntityId.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)),
                destroySimpleMatchLobbyMenuEvent(EntityId.playerASimpleMatchLobbyMenu)
            ])
        ])
    serverScenario(`${Action.ready} 2`, [playerReadyForMatch(EntityId.match, EntityId.playerA), playerReadyForMatch(EntityId.match, EntityId.playerB)],
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(preparingGamePhase).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityId.playerASimpleMatchLobbyMenu]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityId.playerBSimpleMatchLobbyMenu]]])).save()
            .buildEntity(EntityId.playerASimpleMatchLobbyMenu).withPhysicalComponent(position(0, 0), ShapeType.simpleMatchLobbyMenu, true).save()
            .buildEntity(EntityId.playerBSimpleMatchLobbyMenu).withPhysicalComponent(position(0, 0), ShapeType.simpleMatchLobbyMenu, true).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, makePhasing(EntityId.match, preparingGamePhase)),
            (game, adapters) => whenEventOccurs(game, adapters, playerReadyForMatch(EntityId.match, EntityId.playerA)),
            (game, adapters) => whenEventOccurs(game, adapters, playerReadyForMatch(EntityId.match, EntityId.playerB)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, makePhasing(EntityId.match, preparingGamePhase, new Set([EntityId.playerA, EntityId.playerB]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityId.playerA, makePhysical(EntityId.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)),
                destroySimpleMatchLobbyMenuEvent(EntityId.playerASimpleMatchLobbyMenu),
                drawEvent(EntityId.playerB, makePhysical(EntityId.playerBSimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)),
                destroySimpleMatchLobbyMenuEvent(EntityId.playerBSimpleMatchLobbyMenu),
                nextTurnEvent(EntityId.match)
            ])
        ])
})
