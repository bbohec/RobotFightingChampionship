import { it } from 'mocha'
import { expect } from 'chai'
import { GameEvent } from './GameEvent'
import { GenericGame } from '../../Systems/Game/GenericGame'
import { Entity } from '../../Entities/GenericEntity/ports/Entity'
import { PotentialClass } from '../../Entities/GenericEntity/ports/PotentialClass'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
export const whenEventOccurs = (eventDispatcherSystem:GenericGame, event:GameEvent) => it(eventMessage(event), () => eventDispatcherSystem.onGameEvent(event))
const eventMessage = (event:GameEvent): string => `When the event action '${event.action}' occurs with origin entity '${event.originEntityType}' to target entity '${event.targetEntityType}'.`
export function thenTheEntityIsOnRepository <PotentialEntity extends Entity> (adapters: FakeClientAdapters, potentialEntity: PotentialClass<PotentialEntity>) {
    it(`Then the '${potentialEntity.name}' entity is on entities repository`, () => {
        expect(() => adapters.entityInteractor.retrieveEntityByClass(potentialEntity)).to.not.throw()
    })
}
