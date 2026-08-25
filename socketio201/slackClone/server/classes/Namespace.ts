import type { NamespaceData } from '../../contract/dto.ts';
import type { Room } from './Room.ts';

/* rooms is typed as Room[] (the class) rather than RoomData[] (the shape),
   which is still valid because Room implements RoomData. Server-side code
   gets addMessage(); the client only ever sees the plain data. */
export class Namespace implements NamespaceData {
    id: number;
    name: string;
    image: string;
    endpoint: string;
    rooms: Room[] = [];

    constructor(id: number, name: string, image: string, endpoint: string) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.endpoint = endpoint;
    }

    addRoom(room: Room) {
        this.rooms.push(room);
    }
}
