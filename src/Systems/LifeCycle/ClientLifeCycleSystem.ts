import { Visible } from '../../Components/Visible'
import { errorMessageOnUnknownEventAction, GameEvent } from '../../Event/GameEvent'
import { GenericLifeCycleSystem } from './GenericLifeCycleSystem'
import { createMainMenuEvent } from '../../Events/create/create'
import { EntityType } from '../../Event/EntityType'
import { hideEvent } from '../../Events/hide/hide'
import { showEvent } from '../../Events/show/show'
import { Entity } from '../../Entities/Entity'

export class ClientLifeCycleSystem extends GenericLifeCycleSystem {
    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.hasEntitiesByEntityType(EntityType.simpleMatchLobby)) return this.createSimpleMatchLobbyEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent)
        if (gameEvent.hasEntitiesByEntityType(EntityType.mainMenu)) return this.createMainMenuEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent.entityByEntityType(EntityType.player))
        if (gameEvent.hasEntitiesByEntityType(EntityType.game)) return this.createClientGameEntity(this.interactWithIdentiers.nextIdentifier(), gameEvent.entityByEntityType(EntityType.player))
        throw new Error(errorMessageOnUnknownEventAction(ClientLifeCycleSystem.name, gameEvent))
    }

    private createMainMenuEntity (mainMenuEntityId:string, playerId:string): Promise<void> {
        return this.createEntity(
            new Entity(mainMenuEntityId),
            [new Visible(mainMenuEntityId)],
            showEvent(EntityType.mainMenu, mainMenuEntityId, playerId)
        )
    }

    private createSimpleMatchLobbyEntity (simpleMachtLobbyEntityId:string, gameEvent:GameEvent): Promise<void> {
        return this.createEntity(
            new Entity(simpleMachtLobbyEntityId),
            [new Visible(simpleMachtLobbyEntityId)],
            [
                showEvent(EntityType.simpleMatchLobby, simpleMachtLobbyEntityId, gameEvent.entityByEntityType(EntityType.player)),
                hideEvent(EntityType.mainMenu, gameEvent.entityByEntityType(EntityType.mainMenu))
            ]
        )
    }

    private createClientGameEntity (clientGameEntityId:string, playerId:string): Promise<void> {
        return this.createEntity(
            new Entity(clientGameEntityId),
            [],
            createMainMenuEvent(clientGameEntityId, 'unknown', playerId)
        )
    }
}
