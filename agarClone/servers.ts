//Where the servers are created
// Agar.io clone
import express from 'express';
import path from 'node:path';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
// import bcrypt from 'bcrypt';

const app = express();
app.use(express.static(path.join(import.meta.dirname, 'public')));
const expressServer = app.listen(9000);
const io = new Server(expressServer,{
    cors: {
        origin: ['http://localhost:3030'],
        credentials: true,
    }
});

// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash('adminui', salt, function(err, hash) {
//         // Store hash in your password DB.
//         console.log(hash)
//     });
// });

instrument(io, {
    auth: {
        type: "basic",
        username: "admin",
        password: "$2b$10$6/Cu3ozK3ECwVDwt5hXLruraFb9V8yy/zglypGbuxaelWN5GboHPy" // "changeit" encrypted with bcrypt
    },
    mode: "development",
});


// App organization
// servers.js is NOT the entry point. it creates our servers
// and exports them
export { app, io };
