// import { ClientGame } from '../../Entities/ClientGame/ClientGame'
import { LifeCycle } from '../../Component/LifeCycle'
// import { Visible } from '../../Component/Visible'
import { GenericEntity } from '../../Entities/GenericEntity/GenericEntity'
import { GameEvent } from '../../Events/port/GameEvent'
// import { createMainMenuEvent, MainMenuShow, MatchMakingShowEvent } from '../../GameEvent/ports/GameEvents'
// import { MainMenu } from '../../Entities/MainMenu/MainMenu'

// import { ClientGameEventDispatcherSystem } from '../Event/ClientGameEventDispatcherSystem'
import { GenericSystem } from '../Generic/GenericSystem'
// import { MatchMaking } from '../../MatchMaking/MatchMaking'
import { GenericComponent } from '../../Component/GenericComponent'
import { EntityInteractor } from '../../Entities/GenericEntity/ports/EntityInteractor'
import { IdentifierAdapter } from './port/IdentifierAdapter'
import { SystemInteractor } from '../Generic/port/SystemInteractor'
// import { ServerGameEventDispatcherSystem } from '../Event/ServerGameEventDispatcherSystem'

export abstract class GenericLifeCycleSystem extends GenericSystem {
    constructor (interactWithEntities: EntityInteractor, interactWithSystems:SystemInteractor, interactWithIdentifiers:IdentifierAdapter) {
        super(interactWithEntities, interactWithSystems)
        this.interactWithIdentiers = interactWithIdentifiers
    }

    abstract onGameEvent (gameEvent: GameEvent): Promise<void>

    protected createEntity (entity: GenericEntity, components?: GenericComponent[], nextEvent?: GameEvent|GameEvent[]): Promise<void> {
        this.interactWithEntities.addEntity(entity)
        this.addLifeCycleComponent(entity)
        this.addOptionnalComponents(components, entity)
        return this.sendOptionnalNextEvent(nextEvent)
    }

    protected sendNextEvents (nextEvent: GameEvent[]): Promise<void> {
        return Promise.all(nextEvent.map(event => this.sendOptionnalNextEvent(event)))
            .then(() => Promise.resolve())
            .catch(error => Promise.reject(error))
    }

    private addLifeCycleComponent (entity: GenericEntity) {
        entity.addComponent(new LifeCycle(entity.id))
        entity.retrieveComponent(LifeCycle).isCreated = true
    }

    protected abstract sendOptionnalNextEvent (nextEvent?: GameEvent | GameEvent[]): Promise<void>

    private addOptionnalComponents (components: GenericComponent[] | undefined, entity: GenericEntity) {
        if (components) {
            for (const component of components) {
                entity.addComponent(component)
            }
        }
    }

    protected readonly interactWithIdentiers:IdentifierAdapter
}
