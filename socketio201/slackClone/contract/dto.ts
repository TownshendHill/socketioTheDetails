/* Data Transfer Objects — the shapes that actually cross the wire.
   Plain data only, no methods: Socket.IO serialises to JSON, and JSON
   keeps values but drops behaviour. Classes implement these. */

export interface MessageData {
    text: string;
    time: number;
    userName: string;
    avatar: string;
}

export interface RoomData {
    roomId: number;
    roomTitle: string;
    namespaceId: number;
    privateRoom: boolean;
    history: MessageData[];
}

export interface NamespaceData {
    id: number;
    name: string;
    image: string;
    endpoint: string;
    rooms: RoomData[];
}
