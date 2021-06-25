import { ClientGame } from '../../Entities/ClientGame/ClientGame'
import { Visible } from '../../Component/Visible'
import { GameEvent } from '../../Events/port/GameEvent'
import { errorMessageOnUnknownEventAction, newEvent } from '../../Events/port/GameEvents'
import { MainMenu } from '../../Entities/MainMenu/MainMenu'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
import { ClientGameEventDispatcherSystem } from '../GameEventDispatcher/ClientGameEventDispatcherSystem'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby/SimpleMatchLobby'
import { EntityType } from '../../Events/port/EntityType'
import { Action } from '../../Events/port/Action'

export class ClientLifeCycleSystem extends GenericLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.targetEntityType === EntityType.clientGame) return this.createClientGameEntity(this.interactWithIdentiers.nextIdentifier())
        if (gameEvent.targetEntityType === EntityType.simpleMatchLobby) return this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier())
        if (gameEvent.targetEntityType === EntityType.mainMenu) return this.createMainMenuEntity(this.interactWithIdentiers.nextIdentifier())
        throw new Error(errorMessageOnUnknownEventAction(ClientLifeCycleSystem.name, gameEvent))
    }

    private createMainMenuEntity (mainMenuEntityId:string): Promise<void> {
        return this.createEntity(
            new MainMenu(mainMenuEntityId),
            [new Visible(mainMenuEntityId)],
            newEvent(Action.show, EntityType.mainMenu, mainMenuEntityId)
        )
    }

    private createSimpleMatchLobbyEntity (simpleMachtLobbyEntityId:string): Promise<void> {
        return this.createEntity(
            new SimpleMatchLobby(simpleMachtLobbyEntityId),
            [new Visible(simpleMachtLobbyEntityId)],
            [
                newEvent(Action.show, EntityType.simpleMatchLobby),
                newEvent(Action.hide, EntityType.mainMenu)
            ]
        )
    }

    private createClientGameEntity (clientGameEntityId:string): Promise<void> {
        return this.createEntity(
            new ClientGame(clientGameEntityId),
            [],
            newEvent(Action.create, EntityType.mainMenu)
        )
    }

    protected sendOptionnalNextEvent (nextEvent?: GameEvent | GameEvent[]): Promise<void> {
        return (nextEvent === undefined)
            ? Promise.resolve()
            : (!Array.isArray(nextEvent))
                ? this.interactWithSystems.retrieveSystemByClass(ClientGameEventDispatcherSystem).sendEvent(nextEvent)
                : this.sendNextEvents(nextEvent)
    }
}
