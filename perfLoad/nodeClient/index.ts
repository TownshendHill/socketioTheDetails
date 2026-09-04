// The node program that captures local performance data and sends it to the
// server over a socket. Run one of these on every machine you want to monitor.

// Req
// - farmhash
// - socket.io-client

import os from 'node:os';
import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, PerfReading, ServerToClientEvents } from '@perf/contract';

// what info do we need to know from node about performance
// - CPU usage
// - Network I/O
// - System uptime

const cpuAverage = () => {
    const cpus = os.cpus();
    // cpus is an array of all cores. We need the average of all the cores which will give us the cpi average
    let idleMs = 0; // idle milliseconds
    let totalMs = 0; // total milliseconds

    for (const cpu of cpus) {
        // loop through each property of the current core
        for (const mode in cpu.times) {
            // we need all modes for this core added to totalMs
            totalMs += cpu.times[mode as keyof typeof cpu.times];
        }
        // we need the idle mode this core added to idleMs
        idleMs += cpu.times.idle;
    }

    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length,
    };
};

// because the times property on cpis is time since boot, we will get now times, and 100ms fomr now times.
// compare them, that will give us the current load
const getCpuLoad = () =>
    new Promise((resolve, reject) => {
        const start = cpuAverage();

        setTimeout(() => {
            const end = cpuAverage();
            const idleDifference = end.idle - start.idle;
            const totalDifference = end.total - start.total;

            // calculate the CPU load based on the difference in idle and total times
            const percentOfCpu = 100 - Math.floor((100 * idleDifference) / totalDifference);
            resolve(percentOfCpu);
        }, 100);
    });

const performanceLoadData = () =>
    new Promise(async (resolve, reject) => {
        // - OS type
        const osType = os.type() === 'Darwin' ? 'Mac' : os.type();
        console.log('osType: ', osType);

        // - uptime
        const uptime = os.uptime();

        // - Memory usage - total, free, usage
        const freeMem = os.freemem(); // in bytes
        const totalMem = os.totalmem(); // in bytes
        const usedMem = totalMem - freeMem; // in bytes
        const usedMemPercentage = (usedMem / totalMem) * 100; // in percentage
        const memUsage = Math.floor(usedMemPercentage) / 100;
        console.log('freeMem: ', freeMem);
        console.log('totalMem: ', totalMem);
        console.log('usedMem: ', usedMem);
        console.log('usedMemPercentage: ', usedMemPercentage);
        console.log('memUsage: ', memUsage);

        // - CPU info - Type, number of cores, clock speed
        const cpus = os.cpus();
        const cpuType = cpus[0].model;
        const numCores = cpus.length;
        const cpuClockSpeed = cpus[0].speed; // in MHz

        const cpuLoad = await getCpuLoad();

        resolve({
            freeMem,
            totalMem,
            usedMem,
            memUsage,
            osType,
            uptime,
            cpuType,
            numCores,
            cpuClockSpeed,
            cpuLoad,
        });
    });

// console.log('cpus: ', cpus);
// console.log('cpuType: ', cpuType);
// console.log('cpuCores: ', cpuCores);
// console.log('cpuClockSpeed: ', cpuClockSpeed);

// const run = async () => {
//     const data = await performanceLoadData();
//     console.log('performanceLoadData: ', data);
// };

// run();
