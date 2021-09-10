import { Game } from '../../Entities/Game'
import { Visible } from '../../Components/Visible'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { MainMenu } from '../../Entities/MainMenu'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
import { createMainMenuEvent } from '../../Events/create/create'
import { EntityType } from '../../Event/EntityType'
import { hideEvent } from '../../Events/hide/hide'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby'
import { showEvent } from '../../Events/show/show'
import { stringifyWithDetailledSetAndMap } from '../../Event/test'
import { Player } from '../../Entities/Player'

export class ClientLifeCycleSystem extends GenericLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.simpleMatchLobby)) return this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
        if (gameEvent.hasEntitiesByEntityType(EntityType.mainMenu)) return this.createMainMenuEntity(this.interactWithIdentiers.nextIdentifier())
        if (gameEvent.hasEntitiesByEntityType(EntityType.game)) return this.createClientGameEntity(this.interactWithIdentiers.nextIdentifier())
        throw new Error(errorMessageOnUnknownEventAction(ClientLifeCycleSystem.name, gameEvent))
    }

    private createMainMenuEntity (mainMenuEntityId:string): Promise<void> {
        return this.createEntity(
            new MainMenu(mainMenuEntityId),
            [
                new Visible(mainMenuEntityId)
            ],
            showEvent(EntityType.mainMenu, mainMenuEntityId, this.interactWithEntities.retrieveEntityByClass(Player).id)
        )
    }

    private createSimpleMatchLobbyEntity (simpleMachtLobbyEntityId:string, gameEvent:GameEvent): Promise<void> {
        console.log(stringifyWithDetailledSetAndMap(gameEvent))
        return this.createEntity(
            new SimpleMatchLobby(simpleMachtLobbyEntityId),
            [
                new Visible(simpleMachtLobbyEntityId)
            ],
            [
                showEvent(EntityType.simpleMatchLobby, simpleMachtLobbyEntityId, this.interactWithEntities.retrieveEntityByClass(Player).id),
                hideEvent(EntityType.mainMenu, gameEvent.entityByEntityType(EntityType.mainMenu))
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
