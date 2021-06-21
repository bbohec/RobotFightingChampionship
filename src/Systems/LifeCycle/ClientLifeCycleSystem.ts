import { ClientGame } from '../../Entities/ClientGame/ClientGame'
import { Visible } from '../../Component/Visible'
import { GameEvent } from '../../Events/port/GameEvent'
import { createMainMenuEvent, errorMessageOnUnknownEventAction, MainMenuHide, MainMenuShow, simpleMatchLobbyShow } from '../../Events/port/GameEvents'
import { MainMenu } from '../../Entities/MainMenu/MainMenu'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
import { ClientGameEventDispatcherSystem } from '../GameEventDispatcher/ClientGameEventDispatcherSystem'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby/SimpleMatchLobby'

export class ClientLifeCycleSystem extends GenericLifeCycleSystem {
    protected sendOptionnalNextEvent (nextEvent?: GameEvent | GameEvent[]): Promise<void> {
        return (nextEvent === undefined)
            ? Promise.resolve()
            : (!Array.isArray(nextEvent))
                ? this.interactWithSystems.retrieveSystemByClass(ClientGameEventDispatcherSystem).sendEvent(nextEvent)
                : this.sendNextEvents(nextEvent)
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.destination === 'Client Game') { return this.createEntity(new ClientGame('clientGame'), [], createMainMenuEvent) }
        if (gameEvent.destination === 'Simple Match Lobby') { return this.createEntity(new SimpleMatchLobby('Simple Match Lobby'), [new Visible('mainMenu')], [simpleMatchLobbyShow, MainMenuHide]) }
        if (gameEvent.destination === 'Main Menu') { return this.createEntity(new MainMenu('mainMenu'), [new Visible('mainMenu')], MainMenuShow) }
        throw new Error(errorMessageOnUnknownEventAction(ClientLifeCycleSystem.name, gameEvent))
    }
}
