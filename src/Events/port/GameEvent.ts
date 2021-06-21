export type EventDestination =
    'Server Game' |
    'Nobody' |
    'Client Game' |
    'Main Menu' |
    'Match Making'|
    'Simple Match Lobby' |
    'All Entities' |
    'Match'
export type Message =
    'Want to join.' |
    'DAFUQ Message?!' |
    'Hide' |
    'Show' |
    'New Loop' |
    'Waiting for players'|
    'Player join match' |
    'Create'
export interface GameEvent {
    message:Message
    destination:EventDestination
    destinationId?:string
    sourceRef:string
}
