import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import EventSource from 'eventsource'
import { ComponentBuilder } from '../../Components/port/ComponentBuilder'
import { ComponentSerializer } from '../../Components/port/ComponentSerializer'
import { GameEvent } from '../../Event/GameEvent'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'
import { SSEClient } from './SSE/SSEClient'
import { SSEMessageType } from './SSE/SSEMessageType'
import { clientGameEventUrlPath } from './WebServerEventInteractor'
import { ClientEventInteractor } from '../port/EventInteractor'
import { EventBus } from '../../Event/port/EventBus'
import { Logger } from '../../Log/port/logger'
import { stringifyWithDetailledSetAndMap } from '../../Event/detailledStringify'
export const clientBodyRequest = (stringifiedBody:string): string => `CLIENT POST REQUEST : ${stringifiedBody} `
export class WebClientEventInteractor implements ClientEventInteractor, SSEClient {
    constructor (serverFullyQualifiedDomainName: string, webServerPort: number, clientId: string, eventBus: EventBus, logger:Logger) {
        this.clientId = clientId
        this.serverFullyQualifiedDomainName = serverFullyQualifiedDomainName
        this.webServerPort = webServerPort
        this.eventBus = eventBus
        this.logger = logger
    }

    start (): Promise<void> {
        this.logger.info('Start WebClientEventInteractor')
        return new Promise<void>((resolve, reject) => {
            this.subscribeServerSentEvent()
            const interval = setInterval((): void => {
                if (this.sseRegistered) {
                    clearInterval(interval)
                    resolve()
                }
            }, 100)
        })
    }

    stop (): void {
        this.logger.info('Stop WebClientEventInteractor')
        if (this.eventSource)
            this.eventSource.close()
        this.eventSource = undefined
    }

    subscribeServerSentEvent (): void {
        if (this.eventSource) return this.logger.warn('EventSource already configured.')
        const sseUrl = `http://${this.serverFullyQualifiedDomainName}:${this.webServerPort}/serverGameEvents?clientId=${this.clientId}`
        this.logger.info(`subscribeServerSentEvent on url '${sseUrl}'.`)
        this.eventSource = new EventSource(sseUrl)
        this.eventSource.addEventListener(SSEMessageType.GAME_EVENT, event => {
            const messageEvent: MessageEvent<string> = (event as MessageEvent)
            this.logger.info('SSE Message Received', 'message id:', messageEvent.lastEventId)
            this.logger.info('SSE Message Data', messageEvent.data)
            const gameEvent = this.messageEventDataToGameEvent(messageEvent.data)
            this.logger.info('SSE GameEvent', stringifyWithDetailledSetAndMap(gameEvent))
            this.sendEventToClient(gameEvent)
        })
        this.eventSource.addEventListener(SSEMessageType.CLOSE_SSE, event => {
            this.logger.info('closing client SSE...')
            this.stop()
        })
        this.eventSource.addEventListener(SSEMessageType.CONNECTED, event => {
            this.logger.info('SSE Client Registered', this.clientId)
            this.sseRegistered = true
        })
    }

    private messageEventDataToGameEvent (data: string): GameEvent {
        const serializedGameEvent:SerializedGameEvent = JSON.parse(data, (key, value) => typeof value === 'object' && value !== null
            ? value.dataType === 'Map' ? new Map(value.value) : value
            : value
        )
        this.logger.warn('BEFORE BUILD COMPONENTS', serializedGameEvent.components)
        const gameEvent = new GameEvent({
            action: serializedGameEvent.action,
            components: serializedGameEvent.components.map(serializedComponent => {
                const component = this.componentBuilder.buildComponent(serializedComponent)
                return component
            }),
            entityRefences: serializedGameEvent.entityRefences
        })
        this.logger.warn('AFTER BUILD COMPONENTS', gameEvent.components)
        return gameEvent
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
        if (gameEvent instanceof GameEvent)
            gameEvent = this.serializeEvent(gameEvent)
        const body = JSON.stringify(gameEvent, (key: string, value: unknown) => value instanceof Map
            ? { dataType: 'Map', value: Array.from(value.entries()) }
            : value
        )
        const axiosRequestConfig: AxiosRequestConfig = { headers: { 'Content-type': 'application/json' } }
        const url = `http://${this.serverFullyQualifiedDomainName}:${this.webServerPort}${clientGameEventUrlPath}`
        return axios.post(url, body, axiosRequestConfig)
            .then(response => {
                this.logger.info(`Client Sent OK : ${response.status}`)
                return Promise.resolve()
            })
            .catch((error:AxiosError) => (error.response?.status === 500)
                ? Promise.reject(new Error(`Internal Server Error - ${error.response?.data}`))
                : Promise.reject(error))
    }

    sendEventToClient (gameEvent: GameEvent): Promise<void> {
        return this.eventBus.send(gameEvent)
    }

    readonly clientId: string;
    readonly eventBus: EventBus;
    private componentBuilder = new ComponentBuilder();
    private componentSerializer = new ComponentSerializer();
    private serverFullyQualifiedDomainName: string;
    private webServerPort: number;
    private eventSource: EventSource | undefined;
    private sseRegistered: boolean = false
    private logger:Logger
}
