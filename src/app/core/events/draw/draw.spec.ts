import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario, clientScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsClientComponents, thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { componentsAreVisible } from '../../../test/unitTest/visible'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { makePhysical, mainMenuPosition } from '../../ecs/components/Physical'
import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { ShapeType } from '../../type/ShapeType'
import { drawEvent } from './draw'

feature(EventKind.draw, () => {
    serverScenario(`${EventKind.draw} 1`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
        [EntityIds.playerA], [
            thereIsServerComponents(TestStep.Given, []),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, []),
            eventsAreSent(TestStep.Then, EntityIds.playerA, [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))])
        ])
    serverScenario(`${EventKind.draw} 2`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
        [EntityIds.playerA], [
            thereIsServerComponents(TestStep.Given, []),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, []),
            eventsAreSent(TestStep.Then, EntityIds.playerA, [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false))])
        ]
    )
    clientScenario(`${EventKind.draw} 3`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)), EntityIds.playerA,
        [
            thereIsClientComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            componentsAreVisible(TestStep.Given, []),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            componentsAreVisible(TestStep.Then, [makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)])
        ])
    clientScenario(`${EventKind.draw} 4`, drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)), EntityIds.playerA,
        [
            thereIsClientComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            componentsAreVisible(TestStep.Given, [makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)]),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            componentsAreVisible(TestStep.Then, [])
        ]
    )
})
