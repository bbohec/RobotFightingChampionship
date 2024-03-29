import axios, { AxiosError } from 'axios'
import EventSource from 'eventsource'
import { EventBus } from '../../../core/port/EventBus'
import { ClientEventInteractor } from '../../../core/port/EventInteractor'
import { Logger } from '../../../core/port/Logger'
import { GameEvent, newGameEvent } from '../../../core/type/GameEvent'
import { stringifyWithDetailledSetAndMap } from '../../../messages'
import { clientGameEventUrlPath } from '../server/webServerInformation'
import { SSEClient } from '../sse/SSEClient'
import { SSEMessageType } from '../sse/SSEMessage'

export const clientBodyRequest = (stringifiedBody:string): string => `CLIENT POST REQUEST : ${stringifiedBody} `
const sseRegisteredCheckInterval = 100

export class WebClientEventInteractor implements ClientEventInteractor, SSEClient {
    constructor (serverFullyQualifiedDomainName: string, webServerPort: number, clientId: string, eventBus: EventBus, logger:Logger) {
        this.clientId = clientId
        this.serverFullyQualifiedDomainName = serverFullyQualifiedDomainName
        this.webServerPort = webServerPort
        this.eventBus = eventBus
        this.logger = logger
    }

    start (): Promise<void> {
        this.logger.info(`Starting ${this.constructor.name} ...`)
        return new Promise<void>((resolve, reject) => {
            this.subscribeServerSentEvent()
            const interval = setInterval((): void => {
                if (this.sseRegistered) {
                    clearInterval(interval)
                    this.logger.info(`${this.constructor.name} started.`)
                    resolve()
                } // else this.logger.info("Not SSE Registered.")
            }, sseRegisteredCheckInterval)
        })
    }

    stop (): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.logger.info(`Stoping ${this.constructor.name} ${this.clientId} ...`)
            if (this.eventSource) {
                this.eventSource.close()
                this.logger.info(`${this.constructor.name} stoped.`)
                this.eventSource = undefined
            } else {
                this.logger.warn(`${this.constructor.name} already stoped.`)
                resolve()
            }
        })
    }

    subscribeServerSentEvent (): void {
        if (this.eventSource) return this.logger.warn('EventSource already configured.')
        const sseUrl = `http://${this.serverFullyQualifiedDomainName}:${this.webServerPort}/serverGameEvents?clientId=${this.clientId}`
        this.logger.info(`subscribeServerSentEvent on url '${sseUrl}'.`)
        this.eventSource = new EventSource(sseUrl)
        this.eventSource.addEventListener('connected' as SSEMessageType, event => {
            const messageEvent: MessageEvent<string> = (event as MessageEvent)
            this.logger.info('SSE Message Received', 'message id:', messageEvent.lastEventId)
            this.logger.info('SSE Client Registered', this.clientId)
            this.sseRegistered = true
        })
        this.eventSource.addEventListener('gameEvent' as SSEMessageType, event => {
            const messageEvent: MessageEvent<string> = (event as MessageEvent)
            // this.logger.info('SSE Message Received', 'message id:', messageEvent.lastEventId)
            // this.logger.info('SSE Message Data', messageEvent.data)
            const gameEvent = this.messageEventDataToGameEvent(messageEvent.data)
            this.logger.info('SSE GameEvent', stringifyWithDetailledSetAndMap(gameEvent))
            this.sendEventToClient(gameEvent)
        })
        this.eventSource.addEventListener('closeSSE' as SSEMessageType, event => {
            const messageEvent: MessageEvent<string> = (event as MessageEvent)
            this.logger.info('SSE Message Received', 'message id:', messageEvent.lastEventId)
            this.logger.info('Closing client SSE...')
            this.stop()
        })
    }

    private messageEventDataToGameEvent (data: string): GameEvent {
        const parsedGameEvent:GameEvent = JSON.parse(data, (key, value) =>
            typeof value === 'object' && value !== null ? value.dataType === 'Map' ? new Map(value.value) : value : value
        )
        /*
        const gameEvent = new GameEvent({
            action: serializedGameEvent.action,
            components: serializedGameEvent.components.map(serializedComponent => {
                const component = this.componentBuilder.buildComponent(serializedComponent)
                return component
            }),
            entityRefences: serializedGameEvent.entityRefences
        })
        */
        return newGameEvent(parsedGameEvent.action, parsedGameEvent.entityRefences, parsedGameEvent.components, parsedGameEvent.message)
    }

    /* serializeEvent (gameEvent: GameEvent): SerializedGameEvent {
        const serializedEvent = {
            action: gameEvent.action,
            entityRefences: gameEvent.entityRefences,
            components: gameEvent.components.map(component => this.componentSerializer.serializeComponent(component))
        }
        return serializedEvent
    } */

    sendEventToServer (gameEvent: GameEvent): Promise<void> {
        const body = JSON.parse(JSON.stringify(gameEvent, (key: string, value: unknown) => value instanceof Map ? { dataType: 'Map', value: Array.from(value.entries()) } : value))
        const url = `http://${this.serverFullyQualifiedDomainName}:${this.webServerPort}${clientGameEventUrlPath}`
        return axios.post(url, body)
            .then(response => {
                // this.logger.info(`Client Sent OK : ${response.status}`)
                return Promise.resolve()
            })
            .catch((error:AxiosError) => (error.response?.status === 500) ? Promise.reject(new Error(`Internal Server Error - ${error.response.data}`)) : Promise.reject(error))
    }

    sendEventToClient (gameEvent: GameEvent): Promise<void> {
        return this.eventBus.send(gameEvent)
    }

    readonly clientId: string
    readonly eventBus: EventBus
    private serverFullyQualifiedDomainName: string
    private webServerPort: number
    private eventSource: EventSource | undefined
    private sseRegistered: boolean = false
    private logger:Logger
}
