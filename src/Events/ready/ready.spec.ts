
import { makeEntityReference } from '../../Components/EntityReference'
import { makePhasing, preparingGamePhase } from '../../Components/Phasing'
import { makePhysical, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityIsOnRepository, thereIsServerComponents, whenEventOccured, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroySimpleMatchLobbyMenuEvent } from '../destroy/destroy'
import { drawEvent } from '../draw/draw'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { playerReadyForMatch } from './ready'
feature(featureEventDescription(Action.ready), () => {
    serverScenario(`${Action.ready} 1`, playerReadyForMatch(EntityIds.match, EntityIds.playerA),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(preparingGamePhase).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])).save()
            .buildEntity(EntityIds.playerASimpleMatchLobbyMenu).withPhysical(position(0, 0), ShapeType.simpleMatchLobbyMenu, true).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityIds.match),
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, preparingGamePhase),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])),
                makePhysical(EntityIds.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, preparingGamePhase, new Set([EntityIds.playerA])),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])),
                makePhysical(EntityIds.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)),
                destroySimpleMatchLobbyMenuEvent(EntityIds.playerASimpleMatchLobbyMenu)
            ])
        ])
    serverScenario(`${Action.ready} 2`, [playerReadyForMatch(EntityIds.match, EntityIds.playerA), playerReadyForMatch(EntityIds.match, EntityIds.playerB)],
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(preparingGamePhase).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerBSimpleMatchLobbyMenu]]])).save()
            .buildEntity(EntityIds.playerASimpleMatchLobbyMenu).withPhysical(position(0, 0), ShapeType.simpleMatchLobbyMenu, true).save()
            .buildEntity(EntityIds.playerBSimpleMatchLobbyMenu).withPhysical(position(0, 0), ShapeType.simpleMatchLobbyMenu, true).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityIds.match),
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, preparingGamePhase),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerBSimpleMatchLobbyMenu]]])),
                makePhysical(EntityIds.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, true),
                makePhysical(EntityIds.playerBSimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, true)
            ]),
            (game, adapters) => whenEventOccurs(game, adapters, playerReadyForMatch(EntityIds.match, EntityIds.playerA)),
            (game, adapters) => whenEventOccurs(game, adapters, playerReadyForMatch(EntityIds.match, EntityIds.playerB)),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, preparingGamePhase, new Set([EntityIds.playerA, EntityIds.playerB])),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerBSimpleMatchLobbyMenu]]])),
                makePhysical(EntityIds.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false),
                makePhysical(EntityIds.playerBSimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)),
                destroySimpleMatchLobbyMenuEvent(EntityIds.playerASimpleMatchLobbyMenu),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBSimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)),
                destroySimpleMatchLobbyMenuEvent(EntityIds.playerBSimpleMatchLobbyMenu),
                nextTurnEvent(EntityIds.match)
            ])
        ])
})
