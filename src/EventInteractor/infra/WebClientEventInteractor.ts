import axios, { AxiosRequestConfig } from 'axios'
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
export const clientBodyRequest = (stringifiedBody:string): string => `CLIENT POST REQUEST : ${stringifiedBody} `
export class WebClientEventInteractor implements ClientEventInteractor, SSEClient {
    constructor (serverFullyQualifiedDomainName: string, webServerPort: number, clientId: string, eventBus: EventBus) {
        this.clientId = clientId
        this.serverFullyQualifiedDomainName = serverFullyQualifiedDomainName
        this.webServerPort = webServerPort
        this.eventBus = eventBus
    }

    start (): void {
        this.subscribeServerSentEvent()
    }

    subscribeServerSentEvent (): void {
        const sseUrl = `http://${this.serverFullyQualifiedDomainName}:${this.webServerPort}/serverGameEvents?clientId=${this.clientId}`
        console.log(`subscribeServerSentEvent on url '${sseUrl}'.`)
        this.eventSource = new EventSource(sseUrl)
        this.eventSource.addEventListener(SSEMessageType.GAME_EVENT, event => {
            const messageEvent: MessageEvent<string> = (event as MessageEvent)
            console.log('Event', messageEvent)
            this.sendEventToClient(this.messageEventDataToGameEvent(messageEvent.data))
        })
        this.eventSource.addEventListener(SSEMessageType.CLOSE_SSE, event => {
            console.log('closing client SSE...')
            this.stop()
        })
        this.eventSource.addEventListener(SSEMessageType.CONNECTED, event => {
            console.log('SSE Client Registered.')
        })
    }

    private messageEventDataToGameEvent (data: string): GameEvent {
        const serializedGameEvent:SerializedGameEvent = JSON.parse(data, (key, value) => typeof value === 'object' && value !== null
            ? value.dataType === 'Map' ? new Map(value.value) : value
            : value
        )
        return new GameEvent({
            action: serializedGameEvent.action,
            components: serializedGameEvent.components.map(component => this.componentBuilder.buildComponent(component)),
            entityRefences: serializedGameEvent.entityRefences
        })
    }

    stop (): void {
        if (this.eventSource)
            this.eventSource.close()
        this.eventSource = undefined
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
                // console.log(`Client Sent OK : ${response.status}`)
                return Promise.resolve()
            })
            .catch(error => {
                // console.log('Client Error')
                return Promise.reject(error)
            })
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
}
