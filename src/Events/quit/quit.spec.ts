
import { Playable } from '../../Components/Playable'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsNotSent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { destroyMatchEvent, destroyRobotEvent, destroyTowerEvent } from '../destroy/destroy'
import { showEvent } from '../show/show'
import { quitMatchEvent } from './quit'

feature(featureEventDescription(Action.quit), () => {
    serverScenario(`${Action.quit} 1`, quitMatchEvent(EntityId.match, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityId.playerARobot]], [EntityType.tower, [EntityId.playerATower]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA, EntityId.playerB])),
            (game, adapters) => whenEventOccurs(game, quitMatchEvent(EntityId.match, EntityId.playerA)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerB])),
            (game, adapters) => theEventIsNotSent(TestStep.Then, adapters, destroyMatchEvent(EntityId.match)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, destroyRobotEvent(EntityId.playerARobot)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, destroyTowerEvent(EntityId.playerATower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerA))
        ])
    serverScenario(`${Action.quit} 2`, quitMatchEvent(EntityId.match, EntityId.playerB),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerB]).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityId.playerBRobot]], [EntityType.tower, [EntityId.playerBTower]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerB])),
            (game, adapters) => whenEventOccurs(game, quitMatchEvent(EntityId.match, EntityId.playerB)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Playable, new Playable(EntityId.match, [])),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, destroyMatchEvent(EntityId.match)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, destroyRobotEvent(EntityId.playerBRobot)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, destroyTowerEvent(EntityId.playerBTower)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.mainMenu, EntityId.mainMenu, EntityId.playerB))
        ])
})
