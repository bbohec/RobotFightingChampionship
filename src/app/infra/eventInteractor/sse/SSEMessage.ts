import { GameEvent } from '../../../core/type/GameEvent'

export type SSEMessageType = 'gameEvent'|'closeSSE'|'connected'

export interface SSEMessage {
    id: string;
    type: SSEMessageType;
    retry: number;
    data?: string;
}

export const gameEventToSseData = (gameEvent: GameEvent) => JSON.stringify(gameEvent, (key: string, value: unknown) => value instanceof Map
    ? { dataType: 'Map', value: Array.from(value.entries()) }
    : value
)

export const sseDataToGameEvent = (body: string): GameEvent => JSON.parse(body, (key, value) => typeof value === 'object' && value !== null
    ? value.dataType === 'Map' ? new Map(value.value) : value
    : value
)
