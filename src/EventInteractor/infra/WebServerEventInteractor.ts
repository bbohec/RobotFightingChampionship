import { v1 as uuid } from 'uuid'
import { json, urlencoded } from 'body-parser'
import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http'
import { ComponentBuilder } from '../../Components/port/ComponentBuilder'
import { GameEvent } from '../../Event/GameEvent'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'
import { EntityType } from '../../Event/EntityType'
import { ComponentSerializer } from '../../Components/port/ComponentSerializer'
import { SSEMessageType } from './SSE/SSEMessageType'
import { SSEMessage } from './SSE/SSEMessage'
import { ServerEventInteractor } from '../port/EventInteractor'
import { ExpressWebServerInstance } from './ExpressWebServerInstance'
import { EventBus } from '../../Event/port/EventBus'
import { Logger } from '../../Log/port/logger'
export const serverBodyRequest = (stringifiedBody:string): string => `SERVER POST REQUEST : ${stringifiedBody}`
export const clientGameEventUrlPath = '/clientGameEvent'
export const productionSSERetryInterval = 5000
export const defaultHTTPWebServerPort = 80
const sseClientClosedCheckInterval = 100
const sseSendingMessageIntervalCheck = 50
const serverGameEventUrlPath = '/serverGameEvents'
export class WebServerEventInteractor implements ServerEventInteractor {
    constructor (webServer: ExpressWebServerInstance, eventBus: EventBus, sseRetryIntervalMilliseconds: number, logger:Logger) {
        this.webServer = webServer
        this.sseRetryIntervalMilliseconds = sseRetryIntervalMilliseconds
        this.eventBus = eventBus
        this.logger = logger
        this.config()
    }

    start ():Promise<void> {
        return this.webServer.start()
    }

    stop (): Promise<void> {
        this.logger.info(`Stopping ${this.constructor.name} ...`)
        return Promise.all([...this.registeredSSEClientResponses.entries()]
            .map(([clientId, registeredSSEClientResponse]) =>
                this.sendMessageToSSEClientResponse(clientId, registeredSSEClientResponse, closeMessage(uuid(), this.sseRetryIntervalMilliseconds))
            ))
            .then(() => this.waitForAllClientSSEClosed())
            .then(() => this.webServer.close())
            .catch(error => Promise.reject(error))
    }

    waitForAllClientSSEClosed (): Promise<void> {
        this.logger.info('Waiting all SSE client closed ...')
        return new Promise<void>((resolve, reject) => {
            const interval = setInterval((): void => {
                if (this.registeredSSEClientResponses.size === 0) {
                    clearInterval(interval)
                    this.logger.info('All SSE client closed.')
                    resolve()
                } else { this.logger.info(this.registeredSSEClientResponses.size) }
            }, sseClientClosedCheckInterval)
        })
    }

    sendEventToServer (gameEvent: GameEvent): Promise<void> {
        return this.eventBus.send(gameEvent)
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

    private serializeEvent (gameEvent: GameEvent): SerializedGameEvent {
        const serializedEvent = {
            action: gameEvent.action,
            entityRefences: gameEvent.entityRefences,
            components: gameEvent.components.map(component => this.componentSerializer.serializeComponent(component))
        }
        return serializedEvent
    }

    private gameEventFromBody (body:string):GameEvent {
        const parsedBody:SerializedGameEvent = JSON.parse(body, (key, value) => typeof value === 'object' && value !== null
            ? value.dataType === 'Map' ? new Map(value.value) : value
            : value
        )
        return new GameEvent({
            action: parsedBody.action,
            components: parsedBody.components.map(serializedComponent => {
                const component = this.componentBuilder.buildComponent(serializedComponent)
                if (component instanceof Error) throw component
                return component
            }),
            entityRefences: parsedBody.entityRefences
        })
    }

    private registerSSEClient (clientId: string, request:IncomingMessage, response: ServerResponse) {
        request.on('close', () => this.clientDisconnected(clientId))
        response.writeHead(200, sseKeepAliveHeaders)
        this.registeredSSEClientResponses.set(clientId, response)
        this.sendMessageToSSEClientResponse(clientId, response, this.makeSSEEmptyMessage(SSEMessageType.CONNECTED))
    }

    private clientDisconnected (clientId:string): void {
        this.registeredSSEClientResponses.delete(clientId)
    }

    private config () {
        this.webServer.instance.use(urlencoded({ extended: true }))
        this.webServer.instance.use(json())
        this.webServer.instance.post(clientGameEventUrlPath, (request, response) => {
            this.sendEventToServer(this.gameEventFromBody(JSON.stringify(request.body)))
                .then(() => response.status(201).send())
                .catch((error: Error) => {
                    this.logger.error(error.message)
                    response.status(500).send(error.message)
                })
        })
        this.webServer.instance.get(serverGameEventUrlPath, (request, response) => {
            (request.query.clientId && typeof request.query.clientId === 'string')
                ? this.registerSSEClient(request.query.clientId, request, response)
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
        return new Promise<void>((resolve, reject) => {
            const interval = setInterval(() => {
                if (!this.sseSendingMessage) {
                    this.sseSendingMessage = true
                    clearInterval(interval)
                    const sendEventType = (): (error: Error | null | undefined) => void => error => {
                        if (error) reject(error)
                        this.logger.info('[Stream Send]', 'messageType', `'${sseMessage.type}'`)
                        sseClientResponse.write(`event: ${sseMessage.type}\n`, sendRetry())
                    }
                    const sendRetry = (): (error: Error | null | undefined) => void => error => {
                        if (error) reject(error)
                        this.logger.info('[Stream Send]', 'retry', `'${sseMessage.retry}'`)
                        sseClientResponse.write(`retry: ${sseMessage.retry}\n`, sendData())
                    }
                    const sendData = (): (error: Error | null | undefined) => void => error => {
                        if (error) reject(error)
                        this.logger.info('[Stream Send]', 'data', `'${sseMessage.data}'`)
                        sseClientResponse.write(`data: ${sseMessage.data}\n\n`, onSuccess())
                    }
                    const onSuccess = (): (error: Error | null | undefined) => void => error => {
                        if (error) reject(error)
                        this.logger.info('[SSE Message Sent]', 'messageId:', sseMessage.id, 'playerId:', playerId, 'messageType:', sseMessage.type)
                        this.sseSendingMessage = false
                        resolve()
                    }
                    this.logger.info('[Stream Send]', 'id', sseMessage.id)
                    sseClientResponse.write(`id: ${sseMessage.id}\n`, sendEventType())
                }
            }, sseSendingMessageIntervalCheck)
        })

        // sseClientResponse.write(`id: ${sseMessage.id}\n`)
        // sseClientResponse.write(`event: ${sseMessage.type}\n`)
        // sseClientResponse.write(`retry: ${sseMessage.retry}\n`)
        // sseClientResponse.write(`data: ${sseMessage.data}\n\n`)
        //
    }

    readonly eventBus: EventBus;
    private sseSendingMessage: boolean = false
    private componentBuilder = new ComponentBuilder();
    private webServer:ExpressWebServerInstance
    private registeredSSEClientResponses = new Map<string, ServerResponse>();
    private sseRetryIntervalMilliseconds: number;
    private componentSerializer = new ComponentSerializer();
    private logger:Logger
}

export const serverListeningMessage = (port:number): string => `WebServerEventInteractor listening at http://localhost:${port}`
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
