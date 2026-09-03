import { useEffect, useState } from 'react';
import type { PerfData } from '@perf/contract';
import { socket } from '../utilities/socketConnection.ts';
import { Cpu } from './Cpu.tsx';
import { Mem } from './Mem.tsx';
import { Info } from './Info.tsx';
import './Widget.css';

export const Widget = ({ data }: { data: PerfData }) => {
    const [isAlive, setIsAlive] = useState(true);

    const {
        freeMem,
        totalMem,
        usedMem,
        memUseage,
        osType,
        upTime,
        cpuType,
        numCores,
        cpuSpeed,
        cpuLoad,
        macA,
    } = data;

    useEffect(() => {
        // connectedOrNot is about the MONITORED machine, not about this browser.
        // Only react to the one this widget is showing.
        const onConnectedOrNot = ({
            machineMacA,
            isAlive,
        }: {
            machineMacA: string;
            isAlive: boolean;
        }) => {
            if (machineMacA === macA) setIsAlive(isAlive);
        };

        socket.on('connectedOrNot', onConnectedOrNot);
        return () => void socket.off('connectedOrNot', onConnectedOrNot);
    }, [macA]);

    return (
        <div className="widget row justify-content-evenly">
            {!isAlive && <div className="not-active">Offline</div>}
            <Cpu data={{ cpuLoad }} />
            <Mem data={{ freeMem, totalMem, usedMem, memUseage }} />
            <Info data={{ macA, osType, upTime, cpuType, cpuSpeed, numCores }} />
        </div>
    );
};
