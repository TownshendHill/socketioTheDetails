import type { MessageData } from '../contract/dto.ts';

/* Pure formatting: data in, HTML string out. No imports from scripts.ts,
   so this file adds nothing to the circular dependency between the others. */
export const buildMessageHtml = (message: MessageData) => `
    <li>
        <div class="user-image">
            <img src="${message.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${message.userName} <span>${new Date(message.date).toLocaleString()}</span></div>
            <div class="message-text">${message.text}</div>
        </div>
    </li>
`;
