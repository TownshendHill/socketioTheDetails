// Standalone demo of node's cluster module - not part of the app.
// Forks one worker per core, all sharing port 8000, to show that the OS
// round-robins incoming connections between them.
//
//   node clusterTest.ts    then hit http://localhost:8000 a few times

import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) cluster.fork();

    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // workers can share any TCP connection - here, an HTTP server
    http.createServer((_req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
        console.log(`The worker on ${process.pid} has been used!!!!`);
    }).listen(8000);

    console.log(`Worker ${process.pid} started`);
}
