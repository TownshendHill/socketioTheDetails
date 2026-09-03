// The node program that captures local performance data and sends it to the
// server over a socket. Run one of these on every machine you want to monitor.

import os from 'node:os';
import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, PerfReading, ServerToClientEvents } from '@perf/contract';

const SERVER_URL = process.env.SERVER_URL ?? 'http://127.0.0.1:3000';

// generics go on the Socket type, not on io() - Socket<ListenEvents, EmitEvents>
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SERVER_URL, {
    auth: { token: process.env.NODE_CLIENT_TOKEN ?? '239rfaiskdfvq243EGa4q3wefsdad' },
});

socket.on('connect', () => {
    // identify this machine to the server. socket.id changes on reconnect, so
    // use the MAC of the first non-internal interface instead.
    const macA = getMachineId();
    if (!macA) {
        console.error('no external network interface found - cannot identify this machine');
        return;
    }

    const perfDataInterval = setInterval(async () => {
        const perfData = await performanceLoadData();
        socket.emit('perfData', { ...perfData, macA });
    }, 1000);

    // stop ticking on disconnect - this includes the gap before a reconnect
    socket.on('disconnect', () => clearInterval(perfDataInterval));
});

const getMachineId = (): string | undefined => {
    const interfaces = os.networkInterfaces();

    for (const key in interfaces) {
        const first = interfaces[key]?.[0];
        if (first && !first.internal) {
            return first.mac + Math.floor(Math.random() * 100000);
        }
    }

    return undefined;
};

const cpuAverage = () => {
    const cpus = os.cpus();

    // cpus is one entry per core; we want the average across all of them
    let idleMs = 0;
    let totalMs = 0;

    cpus.forEach((aCore) => {
        for (const mode in aCore.times) {
            totalMs += aCore.times[mode as keyof typeof aCore.times];
        }
        idleMs += aCore.times.idle;
    });

    return { idle: idleMs / cpus.length, total: totalMs / cpus.length };
};

// cpu times are cumulative since boot, so a single reading tells us nothing.
// Take two 100ms apart and compare them - the difference is the current load.
const getCpuLoad = () =>
    new Promise<number>((resolve) => {
        const start = cpuAverage();

        setTimeout(() => {
            const end = cpuAverage();
            const idleDiff = end.idle - start.idle;
            const totalDiff = end.total - start.total;

            resolve(100 - Math.floor((100 * idleDiff) / totalDiff));
        }, 100);
    });

const performanceLoadData = async (): Promise<PerfReading> => {
    const cpus = os.cpus();

    const totalMem = os.totalmem(); // bytes
    const freeMem = os.freemem(); // bytes
    const usedMem = totalMem - freeMem;
    const memUseage = Math.floor((usedMem / totalMem) * 100) / 100; // 2 decimal places

    return {
        freeMem,
        totalMem,
        usedMem,
        memUseage,
        osType: os.type() === 'Darwin' ? 'Mac' : os.type(),
        upTime: os.uptime(),
        cpuType: cpus[0].model,
        numCores: cpus.length,
        cpuSpeed: cpus[0].speed,
        cpuLoad: await getCpuLoad(),
    };
};
