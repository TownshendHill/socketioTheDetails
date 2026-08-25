import type { NamespaceData } from '../contract/dto.ts';

export const joinNs = (element: Element, nsData: NamespaceData[]) => {
    const nsEndpoint = element.getAttribute('data-ns');
    console.log('Namespace clicked: ', nsEndpoint);

    const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);
    const rooms = clickedNs?.rooms || [];

    let roomsList = document.querySelector('.room-list') as HTMLDivElement;
    roomsList.innerHTML = ''; // Clear existing rooms

    rooms.forEach((room) => {
        roomsList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span> ${room.roomTitle}</li>`;
    });

    localStorage.setItem('lastNs', nsEndpoint || '');
}
