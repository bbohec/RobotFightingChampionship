import { SSEMessageType } from './SSEMessageType'

export interface SSEMessage {
    id: string;
    type: SSEMessageType;
    retry: number;
    data: string;
}
