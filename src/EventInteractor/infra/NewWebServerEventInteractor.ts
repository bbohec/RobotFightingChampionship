import express from 'express'
import { v1 as uuid } from 'uuid'
import { json, urlencoded } from 'body-parser'
import { OutgoingHttpHeaders, Server, ServerResponse } from 'http'
import { ComponentBuilder } from '../../Components/port/ComponentBuilder'
import { GameEvent } from '../../Event/GameEvent'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'
import { EntityType } from '../../Event/EntityType'
import { ComponentSerializer } from '../../Components/port/ComponentSerializer'
import { SSEMessageType } from './SSE/SSEMessageType'
import { SSEMessage } from './SSE/SSEMessage'
import { InMemoryEventBus } from '../../Event/infra/InMemoryEventBus'
import { NewServerEventInteractor } from '../port/NewEventInteractor'
import { clientGameEventUrlPath } from './ServerWebEventInteractor'

export class NewWebServerEventInteractor implements NewServerEventInteractor {
    constructor (webServerPort: number, sseRetryIntervalMilliseconds: number, eventBus: InMemoryEventBus) {
        this.webServerPort = webServerPort
        this.sseRetryIntervalMilliseconds = sseRetryIntervalMilliseconds
        this.eventBus = eventBus
        this.config()
    }

    eventBus: InMemoryEventBus;

    start () {
        this.server = this.app.listen(this.webServerPort, () => {
            // console.log(`WebServerEventInteractor listening at http://localhost:${this.webServerPort}`)
        })
    }

    stop (): void {
        const sseCloseMessage: SSEMessage = {
            id: uuid(),
            type: SSEMessageType.CLOSE_SSE,
            retry: this.sseRetryIntervalMilliseconds,
            data: ''
        }
        Promise.all([...this.registeredSSEClientResponses.values()].map(registeredSSEClientResponse => this.sendMessageToSSEClientResponse(registeredSSEClientResponse, sseCloseMessage)))
            .then(() => {
                if (this.server)
                    this.server.close(error => {
                        if (error)
                            throw error
                    })
            })
            .catch(error => { throw error })
    }

    serializeEvent (gameEvent: GameEvent): SerializedGameEvent {
        const serializedEvent = {
            action: gameEvent.action,
            entityRefences: gameEvent.entityRefences,
            components: gameEvent.components.map(component => this.componentSerializer.serializeComponent(component))
        }
        return serializedEvent
    }

    sendEventToServer (gameEvent: GameEvent | SerializedGameEvent): Promise<void> {
        if (!(gameEvent instanceof GameEvent))
            gameEvent = new GameEvent({
                action: gameEvent.action,
                components: gameEvent.components.map(component => this.componentBuilder.buildComponent(component)),
                entityRefences: gameEvent.entityRefences
            })
        this.eventBus.events.push(gameEvent)
        return Promise.resolve()
    }

    sendEventToClient (gameEvent: GameEvent | SerializedGameEvent): Promise<void> {
        const gameEventPlayers = gameEvent.entityRefences.get(EntityType.player)
        if (!gameEventPlayers)
            throw new Error('Missing player reference on game event.')
        const sseClientResponse = this.registeredSSEClientResponses.get(gameEventPlayers[0])
        if (!sseClientResponse)
            return Promise.reject(new Error(`SSE Client Id '${gameEventPlayers[0]}' missing on SSE clients.`))
        return this.sendMessageToSSEClientResponse(sseClientResponse, this.makeSSEMessage(SSEMessageType.GAME_EVENT, gameEvent))
    }

    private registerSSEClient (clientId: string, response: ServerResponse) {
        const headers: OutgoingHttpHeaders = {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache'
        }
        response.writeHead(200, headers)
        this.registeredSSEClientResponses.set(clientId, response)
    }

    private config () {
        this.app.use(urlencoded({ extended: true }))
        this.app.use(json())
        this.app.post(clientGameEventUrlPath, (request, response) => {
            const body: string | any = JSON.stringify(request.body)
            this.sendEventToServer(JSON.parse(body, (key, value) => typeof value === 'object' && value !== null
                ? value.dataType === 'Map' ? new Map(value.value) : value
                : value
            ))
                .then(() => response.status(201).send())
                .catch((error: Error) => response.status(500).send(error.message))
        })
        this.app.get('/serverGameEvents', (request, response) => {
            (request.query.clientId && typeof request.query.clientId === 'string')
                ? this.registerSSEClient(request.query.clientId, response)
                : response.status(500).send('Missing clientId parameter')
        })
    }

    private makeSSEMessage (sseEventType: SSEMessageType, gameEvent: GameEvent | SerializedGameEvent): SSEMessage {
        if (gameEvent instanceof GameEvent)
            gameEvent = this.serializeEvent(gameEvent)
        const data = JSON.stringify(gameEvent, (key: string, value: unknown) => value instanceof Map
            ? { dataType: 'Map', value: Array.from(value.entries()) }
            : value
        )
        const sseMessage: SSEMessage = {
            id: uuid(),
            type: sseEventType,
            retry: this.sseRetryIntervalMilliseconds,
            data
        }
        return sseMessage
    }

    private sendMessageToSSEClientResponse (sseClientResponse: ServerResponse, sseMessage: SSEMessage) {
        sseClientResponse.write(`id: ${sseMessage.id}\n`)
        sseClientResponse.write(`event: ${sseMessage.type}\n`)
        sseClientResponse.write(`retry: ${sseMessage.retry}\n`)
        sseClientResponse.write(`data: ${sseMessage.data}\n\n`)
        return Promise.resolve()
    }

    private componentBuilder = new ComponentBuilder();
    private app = express();
    private webServerPort: number;
    private server: Server | undefined;
    private registeredSSEClientResponses = new Map<string, ServerResponse>();
    private sseRetryIntervalMilliseconds: number;
    private componentSerializer = new ComponentSerializer();
}
