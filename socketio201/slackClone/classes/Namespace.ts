/* `import type` because Room is only used as a TYPE here, never called.
   It is erased at build, so this file has no runtime dependency on Room.ts. */
import type { Room } from './Room.ts';

export class Namespace {
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
