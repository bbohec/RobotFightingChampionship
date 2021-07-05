import { Game } from '../../Entities/ClientGame/Game'
import { Visible } from '../../Component/Visible'
import { GameEvent } from '../../Events/port/GameEvent'
import { errorMessageOnUnknownEventAction, newEvent } from '../../Events/port/GameEvents'
import { MainMenu } from '../../Entities/MainMenu/MainMenu'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
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
            newEvent(Action.show, EntityType.nothing, EntityType.mainMenu, mainMenuEntityId)
        )
    }

    private createSimpleMatchLobbyEntity (simpleMachtLobbyEntityId:string): Promise<void> {
        return this.createEntity(
            new SimpleMatchLobby(simpleMachtLobbyEntityId),
            [new Visible(simpleMachtLobbyEntityId)],
            [
                newEvent(Action.show, EntityType.nothing, EntityType.simpleMatchLobby),
                newEvent(Action.hide, EntityType.nothing, EntityType.mainMenu)
            ]
        )
    }

    private createClientGameEntity (clientGameEntityId:string): Promise<void> {
        return this.createEntity(
            new Game(clientGameEntityId),
            [],
            newEvent(Action.create, EntityType.nothing, EntityType.mainMenu)
        )
    }
}
