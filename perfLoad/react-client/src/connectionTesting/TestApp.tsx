import { socket } from '../utilities/socketConnection.ts';
import { useEffect } from 'react';

const TestApp = () => {
    useEffect(() => {
        socket.emit('testConnection', { message: 'Hello from TestApp' });
    }, []);

    return (
        <div>
            <h1>Test App</h1>
        </div>
    );
};

export { TestApp };
