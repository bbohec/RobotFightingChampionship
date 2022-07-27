
import { makeEntityReference } from '../../core/components/EntityReference'
import { makePhasing, preparingGamePhase } from '../../core/components/Phasing'
import { makePhysical, position } from '../../core/components/Physical'
import { ShapeType } from '../../core/type/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../core/type/Action'
import { EntityIds } from '../../test/entityIds'
import { EntityType } from '../../core/type/EntityType'
import { TestStep } from '../../test/TestStep'
import { feature } from '../../test/feature'
import { serverScenario } from '../../test/scenario'
import { thereIsServerComponents } from '../../test/unitTest/component'
import { whenEventOccured, eventsAreSent, whenEventOccurs } from '../../test/unitTest/event'
import { destroySimpleMatchLobbyMenuEvent } from '../destroy/destroy'
import { drawEvent } from '../draw/draw'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { playerReadyForMatch } from './ready'
feature(Action.ready, () => {
    serverScenario(`${Action.ready} 1`, playerReadyForMatch(EntityIds.match, EntityIds.playerA),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(preparingGamePhase).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])).save()
            .buildEntity(EntityIds.playerASimpleMatchLobbyMenu).withPhysical(position(0, 0), ShapeType.simpleMatchLobbyMenu, true).save()
        , [
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
            eventsAreSent(TestStep.And, 'server', [
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
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, preparingGamePhase),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerBSimpleMatchLobbyMenu]]])),
                makePhysical(EntityIds.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, true),
                makePhysical(EntityIds.playerBSimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, true)
            ]),
            whenEventOccurs(playerReadyForMatch(EntityIds.match, EntityIds.playerA)),
            whenEventOccurs(playerReadyForMatch(EntityIds.match, EntityIds.playerB)),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, preparingGamePhase, new Set([EntityIds.playerA, EntityIds.playerB])),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.playerBSimpleMatchLobbyMenu]]])),
                makePhysical(EntityIds.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false),
                makePhysical(EntityIds.playerBSimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)
            ]),
            eventsAreSent(TestStep.And, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerASimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)),
                destroySimpleMatchLobbyMenuEvent(EntityIds.playerASimpleMatchLobbyMenu),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBSimpleMatchLobbyMenu, position(0, 0), ShapeType.simpleMatchLobbyMenu, false)),
                destroySimpleMatchLobbyMenuEvent(EntityIds.playerBSimpleMatchLobbyMenu),
                nextTurnEvent(EntityIds.match)
            ])
        ])
})
