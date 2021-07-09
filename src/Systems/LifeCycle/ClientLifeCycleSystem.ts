import { Game } from '../../Entities/Game'
import { Visible } from '../../Component/Visible'
import { GameEvent } from '../../Events/port/GameEvent'
import { errorMessageOnUnknownEventAction, MissingOriginEntityId, MissingTargetEntityId } from '../../Events/port/GameEvents'
import { MainMenu } from '../../Entities/MainMenu'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
import { createMainMenuEvent } from '../../Events/create/create'
import { EntityType } from '../../Events/port/EntityType'
import { hideEvent } from '../../Events/hide/hide'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby'
import { showEvent } from '../../Events/show/show'
import { simpleMatchLobbyEntityId } from '../../Events/port/entityIds'

export class ClientLifeCycleSystem extends GenericLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.targetEntityType === EntityType.game) return this.createClientGameEntity(this.interactWithIdentiers.nextIdentifier())
        if (gameEvent.targetEntityType === EntityType.simpleMatchLobby) return this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
        if (gameEvent.targetEntityType === EntityType.mainMenu) return this.createMainMenuEntity(this.interactWithIdentiers.nextIdentifier())
        throw new Error(errorMessageOnUnknownEventAction(ClientLifeCycleSystem.name, gameEvent))
    }

    private createMainMenuEntity (mainMenuEntityId:string): Promise<void> {
        return this.createEntity(
            new MainMenu(mainMenuEntityId),
            [new Visible(mainMenuEntityId)],
            showEvent(EntityType.mainMenu, mainMenuEntityId)
        )
    }

    private createSimpleMatchLobbyEntity (simpleMachtLobbyEntityId:string, gameEvent:GameEvent): Promise<void> {
        if (!gameEvent.originEntityId) throw new Error(MissingOriginEntityId)
        if (!gameEvent.targetEntityId) throw new Error(MissingTargetEntityId)
        return this.createEntity(
            new SimpleMatchLobby(simpleMachtLobbyEntityId),
            [new Visible(simpleMachtLobbyEntityId)],
            [
                showEvent(EntityType.simpleMatchLobby, simpleMatchLobbyEntityId),
                hideEvent(EntityType.mainMenu, gameEvent.targetEntityId)
            ]
        )
    }

    private createClientGameEntity (clientGameEntityId:string): Promise<void> {
        return this.createEntity(
            new Game(clientGameEntityId),
            [],
            createMainMenuEvent(clientGameEntityId, 'unknown')
        )
    }
}
