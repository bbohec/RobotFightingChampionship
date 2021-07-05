import { LifeCycle } from '../../Component/LifeCycle'
import { GenericEntity } from '../../Entities/GenericEntity/GenericEntity'
import { GameEvent } from '../../Events/port/GameEvent'
import { GenericSystem } from '../Generic/GenericSystem'
import { GenericComponent } from '../../Component/GenericComponent'
import { EntityInteractor } from '../../Entities/GenericEntity/ports/EntityInteractor'
import { IdentifierAdapter } from './port/IdentifierAdapter'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { EntityType } from '../../Events/port/EntityType'
import { newEvent } from '../../Events/port/GameEvents'
import { Action } from '../../Events/port/Action'
const action = Action.create
export const createGameEvent = newEvent(Action.create, EntityType.nothing, EntityType.game)
export const createMainMenuEvent = (gameEntityId:string, mainMenuEntityId:string) => newEvent(Action.create, EntityType.nothing, EntityType.mainMenu, mainMenuEntityId, gameEntityId)
export const createGridEvent = (matchId:string) => newEvent(Action.create, EntityType.nothing, EntityType.grid, undefined, matchId)
export const createTowerEvent = (playerId:string) => newEvent(action, EntityType.nothing, EntityType.tower, undefined, playerId)
export const createRobotEvent = (playerId:string) => newEvent(action, EntityType.nothing, EntityType.robot, undefined, playerId)
export const createSimpleMatchLobbyEvent = (gameEntityId:string, mainMenuEntityId:string) => newEvent(action, EntityType.nothing, EntityType.simpleMatchLobby, gameEntityId, mainMenuEntityId)
export const createMatchEvent = newEvent(action, EntityType.nothing, EntityType.match)
export const createPlayerEvent = newEvent(action, EntityType.nothing, EntityType.player)
export abstract class GenericLifeCycleSystem extends GenericSystem {
    constructor (interactWithEntities: EntityInteractor, interactWithGameEventDispatcher:GenericGameEventDispatcherSystem, interactWithIdentifiers:IdentifierAdapter) {
        super(interactWithEntities, interactWithGameEventDispatcher)
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

    protected sendOptionnalNextEvent (nextEvent?: GameEvent | GameEvent[]): Promise<void> {
        return (nextEvent === undefined)
            ? Promise.resolve()
            : (!Array.isArray(nextEvent))
                ? this.sendEvent(nextEvent)
                : this.sendNextEvents(nextEvent)
    }

    private addOptionnalComponents (components: GenericComponent[] | undefined, entity: GenericEntity) {
        if (components) {
            for (const component of components) {
                entity.addComponent(component)
            }
        }
    }

    protected readonly interactWithIdentiers:IdentifierAdapter
}
