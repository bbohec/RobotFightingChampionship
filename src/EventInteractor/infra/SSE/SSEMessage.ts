export type SSEMessageType = 'gameEvent'|'closeSSE'|'connected'

export interface SSEMessage {
    id: string;
    type: SSEMessageType;
    retry: number;
    data?: string;
}
