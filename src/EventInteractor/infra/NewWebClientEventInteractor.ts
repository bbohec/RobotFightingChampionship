import axios, { AxiosRequestConfig } from 'axios'
import EventSource from 'eventsource'
import { ComponentBuilder } from '../../Components/port/ComponentBuilder'
import { ComponentSerializer } from '../../Components/port/ComponentSerializer'
import { GameEvent } from '../../Event/GameEvent'
import { SerializedGameEvent } from '../../Event/SerializedGameEvent'
import { InMemoryEventBus } from '../../Event/infra/InMemoryEventBus'
import { SSEClient } from './SSE/SSEClient'
import { SSEMessageType } from './SSE/SSEMessageType'
import { NewClientEventInteractor } from '../port/EventInteractor'
import { clientGameEventUrlPath } from '../../Systems/GameEventDispatcher/infra/ServerWebEventInteractor'
export const clientBodyRequest = (stringifiedBody:string): string => `CLIENT POST REQUEST : ${stringifiedBody} `

export class NewWebClientEventInteractor implements NewClientEventInteractor, SSEClient {
    constructor (serverFullyQualifiedDomainName: string, webServerPort: number, clientId: string, eventBus: InMemoryEventBus) {
        this.clientId = clientId
        this.serverFullyQualifiedDomainName = serverFullyQualifiedDomainName
        this.webServerPort = webServerPort
        this.eventBus = eventBus
    }

    start (): void {
        this.subscribeServerSentEvent()
    }

    subscribeServerSentEvent (): void {
        this.eventSource = new EventSource(`http://${this.serverFullyQualifiedDomainName}:${this.webServerPort}/serverGameEvents?clientId=${this.clientId}`)
        this.eventSource.addEventListener(SSEMessageType.GAME_EVENT, event => {
            const messageEvent: MessageEvent<string> = (event as MessageEvent)
            // console.log('Event', messageEvent)
            this.sendEventToClient(
                JSON.parse(messageEvent.data, (key, value) => typeof value === 'object' && value !== null
                    ? value.dataType === 'Map' ? new Map(value.value) : value
                    : value
                )
            )
        })
        this.eventSource.addEventListener(SSEMessageType.CLOSE_SSE, event => {
            // console.log('closing client SSE...')
            this.stop()
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

    sendEventToClient (gameEvent: GameEvent | SerializedGameEvent): Promise<void> {
        if (!(gameEvent instanceof GameEvent))
            gameEvent = new GameEvent({
                action: gameEvent.action,
                components: gameEvent.components.map(component => this.componentBuilder.buildComponent(component)),
                entityRefences: gameEvent.entityRefences
            })
        this.eventBus.send(gameEvent)
        return Promise.resolve()
    }

    readonly clientId: string;
    eventBus: InMemoryEventBus;
    private componentBuilder = new ComponentBuilder();
    private componentSerializer = new ComponentSerializer();
    private serverFullyQualifiedDomainName: string;
    private webServerPort: number;
    private eventSource: EventSource | undefined;
}
