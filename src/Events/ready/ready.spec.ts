
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
import { playerReadyForMatch } from './ready'
import { Action } from '../../Event/Action'
import { feature, featureEventDescription, serverScenario, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, eventsAreSent, whenEventOccured, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
feature(featureEventDescription(Action.ready), () => {
    serverScenario(`${Action.ready} 1`, playerReadyForMatch(EntityId.match, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(preparingGamePhase).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, preparingGamePhase)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, preparingGamePhase, new Set([EntityId.playerA])))
        ])
    serverScenario(`${Action.ready} 2`, [playerReadyForMatch(EntityId.match, EntityId.playerA), playerReadyForMatch(EntityId.match, EntityId.playerB)],
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(preparingGamePhase).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, preparingGamePhase)),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(EntityId.match, EntityId.playerA)),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(EntityId.match, EntityId.playerB)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, preparingGamePhase, new Set([EntityId.playerA, EntityId.playerB]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [nextTurnEvent(EntityId.match)])
        ])
})
