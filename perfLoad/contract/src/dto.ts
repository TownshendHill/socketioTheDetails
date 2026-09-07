/* The shapes that cross the wire. Plain data only - Socket.IO serialises to
   JSON, which keeps values and drops behaviour. */

/** One reading from one monitored machine, sent once per second. */
export interface PerfData {
    /** identifies the machine - its MAC address */
    macA: string;
    freeMem: number;
    totalMem: number;
    usedMem: number;
    /** 0..1, to two decimal places */
    memUsage: number;
    osType: string;
    /** seconds since boot */
    uptime: number;
    cpuType: string;
    numCores: number;
    /** MHz */
    cpuClockSpeed: number;
    /** 0..100 */
    cpuLoad: number;
}

/** Everything except the machine id - what the nodeClient computes before
    stamping its own macA on it. */
export type PerfReading = Omit<PerfData, 'macA'>;

/** A monitored machine appearing or going away. */
export interface ConnectedOrNot {
    machineMacA: string;
    isAlive: boolean;
}
