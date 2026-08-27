import type { NamespaceData } from '../contract/dto.ts';
import { joinRoom } from './joinRoom.ts';
import { setSelectedNsId } from './scripts.ts';

export const joinNs = (element: Element, nsData: NamespaceData[]) => {
    const nsEndpoint = element.getAttribute('data-ns');
    console.log('Namespace clicked: ', nsEndpoint);

    const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);
    setSelectedNsId(clickedNs?.id ?? 0); // update the global with the selected namespace ID
    const rooms = clickedNs?.rooms || [];

    const roomsList = document.querySelector('.room-list') as HTMLUListElement;
    roomsList.innerHTML = ''; // Clear existing rooms

    // init firstRoom var
    let firstRoom: string | null = null;

    rooms.forEach((room, i) => {
        if (i === 0) {
            firstRoom = room.roomTitle;
        }

        roomsList.innerHTML += `<li class="room" namespaceId="${room.namespaceId}">
            <span class="fa-solid fa-${room.privateRoom ? 'lock' : 'globe'}"></span> ${room.roomTitle}</li>
        `;
    });

    // init join first room
    joinRoom(firstRoom || '', clickedNs?.id || 0);

    // add click listener to each room
    const roomNodes = document.querySelectorAll('.room');
    Array.from(roomNodes).forEach((roomNode) => {
        roomNode.addEventListener('click', (e) => {
            // currentTarget is always the <li> the listener is bound to.
            // e.target could be the icon <span> the user actually clicked.
            const li = e.currentTarget as HTMLLIElement;
            const namespaceId = Number(li.getAttribute('namespaceId'));
            joinRoom(li.innerText.trim(), namespaceId);
        });
    });

    localStorage.setItem('lastNs', nsEndpoint || '');
};
