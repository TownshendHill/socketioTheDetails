import type { MessageData, RoomData } from '../../contract/dto.ts';

/* `implements RoomData` makes the compiler enforce that this class matches
   the wire shape. Add a field to RoomData and this class fails to compile
   until it is added here too — the two can no longer drift apart. */
export class Room implements RoomData {
    roomId: number;
    roomTitle: string;
    namespaceId: number;
    privateRoom: boolean;
    history: MessageData[] = [];

    constructor(roomId: number, roomTitle: string, namespaceId: number, privateRoom = false) {
        this.roomId = roomId;
        this.roomTitle = roomTitle;
        this.namespaceId = namespaceId;
        this.privateRoom = privateRoom;
    }

    addMessage(message: MessageData) {
        this.history.push(message);
    }

    clearHistory() {
        this.history = [];
    }
}
