// Where the servers are created
// Agar.io clone
import express from 'express';
import path from 'node:path';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
// import bcrypt from 'bcrypt';

const app = express();
app.use(express.static(path.join(import.meta.dirname, 'public')));

const expressServer = app.listen(9000);
const io = new Server(expressServer);



// App organization
// servers.js is NOT the entry point. it creates our servers
// and exports them
export { app, io };
