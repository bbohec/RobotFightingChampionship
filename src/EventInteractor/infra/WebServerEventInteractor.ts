import { Express } from 'express'
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
import { ServerEventInteractor } from '../port/EventInteractor'
export const serverBodyRequest = (stringifiedBody:string): string => `SERVER POST REQUEST : ${stringifiedBody}`
export const clientGameEventUrlPath = '/clientGameEvent'
export const productionSSERetryInterval = 5000
export const defaultHTTPWebServerPort = 80
export class ExpressWebServerInstance {
    constructor (instance:Express, port: number) {
        this.port = port
        this.instance = instance
    }

    start () {
        this.server = this.instance.listen(this.port, () => console.log(serverListeningMessage(this.port)))
    }

    close () {
        if (this.server) this.server.close(error => { if (error) throw error })
    }

    readonly instance:Express
    readonly port:number
    private server: Server | undefined;
}

const serverGameEventUrlPath = '/serverGameEvents'
export class WebServerEventInteractor implements ServerEventInteractor {
    constructor (webServer: ExpressWebServerInstance, eventBus: InMemoryEventBus, sseRetryIntervalMilliseconds: number) {
        this.webServer = webServer
        this.sseRetryIntervalMilliseconds = sseRetryIntervalMilliseconds
        this.eventBus = eventBus
        this.config()
    }

    eventBus: InMemoryEventBus;

    start () {
        this.webServer.start()
    }

    stop (): void {
        Promise.all([...this.registeredSSEClientResponses.entries()]
            .map(([clientId, registeredSSEClientResponse]) =>
                this.sendMessageToSSEClientResponse(clientId, registeredSSEClientResponse, closeMessage(uuid(), this.sseRetryIntervalMilliseconds))
            )
        )
            .then(() => this.webServer.close())
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

    sendEventToServer (gameEvent: GameEvent): Promise<void> {
        this.eventBus.events.push(gameEvent)
        return Promise.resolve()
    }

    private gameEventFromBody (body:string):GameEvent {
        const parsedBody:SerializedGameEvent = JSON.parse(body, (key, value) => typeof value === 'object' && value !== null
            ? value.dataType === 'Map' ? new Map(value.value) : value
            : value
        )
        return new GameEvent({
            action: parsedBody.action,
            components: parsedBody.components.map(component => this.componentBuilder.buildComponent(component)),
            entityRefences: parsedBody.entityRefences
        })
    }

    sendEventToClient (gameEvent: GameEvent): Promise<void> {
        const gameEventPlayers = gameEvent.entityRefences.get(EntityType.player)
        if (!gameEventPlayers) return Promise.reject(new Error(missingPlayerReferenceOnGameEventMessage))
        const playerId = gameEventPlayers[0]
        const sseClientResponse = this.registeredSSEClientResponses.get(playerId)
        return (sseClientResponse && playerId)
            ? this.sendMessageToSSEClientResponse(playerId, sseClientResponse, this.makeSSEGameEventMessage(SSEMessageType.GAME_EVENT, gameEvent))
            : Promise.reject(new Error(sseClientMissingMessage(playerId)))
    }

    private registerSSEClient (clientId: string, response: ServerResponse) {
        response.writeHead(200, sseKeepAliveHeaders)
        this.registeredSSEClientResponses.set(clientId, response)
        this.sendMessageToSSEClientResponse(clientId, response, this.makeSSEEmptyMessage(SSEMessageType.CONNECTED))
    }

    private config () {
        this.webServer.instance.use(urlencoded({ extended: true }))
        this.webServer.instance.use(json())
        this.webServer.instance.post(clientGameEventUrlPath, (request, response) => {
            this.sendEventToServer(this.gameEventFromBody(JSON.stringify(request.body)))
                .then(() => response.status(201).send())
                .catch((error: Error) => response.status(500).send(error.message))
        })
        this.webServer.instance.get(serverGameEventUrlPath, (request, response) => {
            (request.query.clientId && typeof request.query.clientId === 'string')
                ? this.registerSSEClient(request.query.clientId, response)
                : response.status(500).send('Missing clientId parameter')
        })
    }

    private makeSSEEmptyMessage (sseEventType: SSEMessageType): SSEMessage {
        return sseMessage(uuid(), sseEventType, this.sseRetryIntervalMilliseconds)
    }

    private makeSSEGameEventMessage (sseEventType: SSEMessageType, gameEvent: GameEvent | SerializedGameEvent): SSEMessage {
        if (gameEvent instanceof GameEvent) gameEvent = this.serializeEvent(gameEvent)
        const data = JSON.stringify(gameEvent, (key: string, value: unknown) => value instanceof Map
            ? { dataType: 'Map', value: Array.from(value.entries()) }
            : value
        )
        return sseMessage(uuid(), sseEventType, this.sseRetryIntervalMilliseconds, data)
    }

    private sendMessageToSSEClientResponse (playerId:string, sseClientResponse: ServerResponse, sseMessage: SSEMessage) {
        console.log('Send SSE Message', playerId, sseMessage)
        sseClientResponse.write(`id: ${sseMessage.id}\n`)
        sseClientResponse.write(`event: ${sseMessage.type}\n`)
        sseClientResponse.write(`retry: ${sseMessage.retry}\n`)
        sseClientResponse.write(`data: ${sseMessage.data}\n\n`)
        return Promise.resolve()
    }

    private componentBuilder = new ComponentBuilder();
    private webServer:ExpressWebServerInstance
    private registeredSSEClientResponses = new Map<string, ServerResponse>();
    private sseRetryIntervalMilliseconds: number;
    private componentSerializer = new ComponentSerializer();
}

const serverListeningMessage = (port:number): string => `WebServerEventInteractor listening at http://localhost:${port}`
const closeMessage = (messageId:string, sseRetryIntervalMilliseconds:number): SSEMessage => ({
    id: messageId,
    type: SSEMessageType.CLOSE_SSE,
    retry: sseRetryIntervalMilliseconds,
    data: ''
})
const sseMessage = (messageId:string, sseEventType: SSEMessageType, sseRetryIntervalMilliseconds:number, data?:string): SSEMessage => ({
    id: messageId,
    type: sseEventType,
    retry: sseRetryIntervalMilliseconds,
    data
})
const sseKeepAliveHeaders: OutgoingHttpHeaders = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache'
}
const sseClientMissingMessage = (playerId: string): string => `SSE Client Id '${playerId}' missing on SSE clients.`
const missingPlayerReferenceOnGameEventMessage = 'Missing player reference on game event.'
