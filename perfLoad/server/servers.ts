// Socket.io server that services both the node and react clients.
//
// Entry point for our cluster: the primary makes workers, and the workers do
// the Socket.IO handling. See https://github.com/elad/node-cluster-socket.io
//
// - @socket.io/sticky          so a client finds its way back to the same worker
// - @socket.io/cluster-adapter so any worker can emit to everyone

import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';
import { Server } from 'socket.io';
import { setupMaster, setupWorker } from '@socket.io/sticky';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import type { ClientToServerEvents, ServerToClientEvents } from '@perf/contract';
import { socketMain } from './socketMain.ts';

const numCPUs = os.cpus().length;
const PORT = Number(process.env.PORT ?? 3000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:3001';

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    const httpServer = http.createServer();

    // sticky sessions: route a returning client back to its worker
    setupMaster(httpServer, { loadBalancingMethod: 'least-connection' });

    // connections between the workers
    setupPrimary();

    // needed for packets containing buffers
    cluster.setupPrimary({ serialization: 'advanced' });

    httpServer.listen(PORT); // internet facing

    for (let i = 0; i < numCPUs; i++) cluster.fork();

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} started`);

    const httpServer = http.createServer();
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
        cors: { origin: CLIENT_ORIGIN, credentials: true },
    });

    io.adapter(createAdapter()); // replace the default in-memory adapter
    setupWorker(io); // connect this worker to the primary

    socketMain(io, process.pid);
}
