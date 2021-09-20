import { describe } from 'mocha'
import { Action } from '../../Event/Action'
import { matchId, playerAId, playerBId, playerARobotId, playerBRobotId, playerATowerId, playerBTowerId } from '../../Event/entityIds'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { Hittable } from '../../Components/Hittable'
import { hitEvent } from './hit'
import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'
import { victoryEvent } from '../victory/victory'
import { EntityBuilder } from '../../Entities/entityBuilder'
describe(featureEventDescription(Action.hit), () => {
    serverScenario(`${Action.hit} 1 - Robot Hit Tower`, hitEvent(playerARobotId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(playerARobotId).withDamagePoints(20).save()
            .buildEntity(playerBTowerId).withHitPoints(100).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 100)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 80))
        ])

    serverScenario(`${Action.hit} 2 - Robot Kill Tower`, hitEvent(playerARobotId, playerBTowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPlayers([playerAId, playerBId]).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]]])).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.match, [matchId]]])).save()
            .buildEntity(playerARobotId).withEntityReferences(new Map([[EntityType.player, [playerAId]]])).withDamagePoints(20).save()
            .buildEntity(playerBTowerId).withEntityReferences(new Map([[EntityType.player, [playerBId]]])).withHitPoints(100).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 100)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, EntityReference, new EntityReference(playerARobotId, new Map([[EntityType.player, [playerAId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, EntityReference, new EntityReference(playerBTowerId, new Map([[EntityType.player, [playerBId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[EntityType.match, [matchId]]]))),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBTowerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 0)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, victoryEvent(matchId, playerAId))
        ])
    serverScenario(`${Action.hit} 3 - Robot Kill Robot`, hitEvent(playerARobotId, playerBRobotId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPlayers([playerAId, playerBId]).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]]])).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.match, [matchId]]])).save()
            .buildEntity(playerARobotId).withEntityReferences(new Map([[EntityType.player, [playerAId]]])).withDamagePoints(20).save()
            .buildEntity(playerBRobotId).withEntityReferences(new Map([[EntityType.player, [playerBId]]])).withHitPoints(50).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerBRobotId, Hittable, new Hittable(playerBRobotId, 50)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, EntityReference, new EntityReference(playerARobotId, new Map([[EntityType.player, [playerAId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, EntityReference, new EntityReference(playerBRobotId, new Map([[EntityType.player, [playerBId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[EntityType.match, [matchId]]]))),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBRobotId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBRobotId, Hittable, new Hittable(playerBRobotId, -10)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, victoryEvent(matchId, playerAId))
        ])
    serverScenario(`${Action.hit} 4 - Tower Kill Robot`, hitEvent(playerATowerId, playerBRobotId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPlayers([playerAId, playerBId]).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]]])).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.match, [matchId]]])).save()
            .buildEntity(playerATowerId).withEntityReferences(new Map([[EntityType.player, [playerAId]]])).withDamagePoints(5).save()
            .buildEntity(playerBRobotId).withEntityReferences(new Map([[EntityType.player, [playerBId]]])).withHitPoints(50).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerBRobotId, Hittable, new Hittable(playerBRobotId, 50)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, EntityReference, new EntityReference(playerATowerId, new Map([[EntityType.player, [playerAId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBRobotId, EntityReference, new EntityReference(playerBRobotId, new Map([[EntityType.player, [playerBId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[EntityType.match, [matchId]]]))),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerATowerId, playerBRobotId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerBRobotId, Hittable, new Hittable(playerBRobotId, 0)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, victoryEvent(matchId, playerAId))
        ])
    serverScenario(`${Action.hit} 5 - Tower Kill Tower`, hitEvent(playerBTowerId, playerATowerId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPlayers([playerAId, playerBId]).save()
            .buildEntity(playerAId).withEntityReferences(new Map([[EntityType.match, [matchId]]])).save()
            .buildEntity(playerBId).withEntityReferences(new Map([[EntityType.match, [matchId]]])).save()
            .buildEntity(playerATowerId).withEntityReferences(new Map([[EntityType.player, [playerAId]]])).withHitPoints(100).save()
            .buildEntity(playerBTowerId).withEntityReferences(new Map([[EntityType.player, [playerBId]]])).withDamagePoints(5).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerATowerId, Hittable, new Hittable(playerATowerId, 100)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerATowerId, EntityReference, new EntityReference(playerATowerId, new Map([[EntityType.player, [playerAId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, EntityReference, new EntityReference(playerBTowerId, new Map([[EntityType.player, [playerBId]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBId, EntityReference, new EntityReference(playerBId, new Map([[EntityType.match, [matchId]]]))),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => whenEventOccurs(game, hitEvent(playerBTowerId, playerATowerId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Hittable, new Hittable(playerATowerId, 0)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, victoryEvent(matchId, playerBId))
        ])
    serverScenario(`${Action.hit} 6 - Friendly Fire`, hitEvent(playerATowerId, playerBRobotId), undefined, [
        (game, adapters) => whenEventOccurs(game, hitEvent(playerARobotId, playerBRobotId))
    ], undefined, true)
})
