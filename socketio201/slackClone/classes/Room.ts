export interface Message {
    text: string;
    time: number;
    userName: string;
    avatar: string;
}

export class Room {
    roomId: number;
    roomTitle: string;
    namespaceId: number;
    privateRoom: boolean;
    history: Message[] = [];

    constructor(roomId: number, roomTitle: string, namespaceId: number, privateRoom = false) {
        this.roomId = roomId;
        this.roomTitle = roomTitle;
        this.namespaceId = namespaceId;
        this.privateRoom = privateRoom;
    }

    addMessage(message: Message) {
        this.history.push(message);
    }

    clearHistory() {
        this.history = [];
    }
}
