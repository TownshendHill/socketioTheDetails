import { useEffect, useRef } from 'react';
import { drawCircle } from '../utilities/canvasLoadAnimation.ts';

const BYTES_PER_GB = 1073741824;

interface MemProps {
    data: { freeMem: number; totalMem: number; usedMem: number; memUseage: number };
}

export const Mem = ({ data }: MemProps) => {
    const { freeMem, memUseage, totalMem } = data;
    const memRef = useRef<HTMLCanvasElement>(null);

    const totalMemInGB = Math.floor((totalMem / BYTES_PER_GB) * 100) / 100;
    const freeMemInGB = Math.floor((freeMem / BYTES_PER_GB) * 100) / 100;

    useEffect(() => drawCircle(memRef.current, memUseage * 100), [memUseage]);

    return (
        <div className="mem col-3">
            <h3>Memory Usage</h3>
            <div className="canvas-wrapper">
                <canvas ref={memRef} width="200" height="200"></canvas>
                <div className="mem-text">{memUseage * 100}%</div>
            </div>
            <div>Total Memory: {totalMemInGB}gb</div>
            <div>Free Memory: {freeMemInGB}gb</div>
        </div>
    );
};
