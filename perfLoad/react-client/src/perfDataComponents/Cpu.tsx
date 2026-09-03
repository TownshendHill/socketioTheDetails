import { useEffect, useRef } from 'react';
import { drawCircle } from '../utilities/canvasLoadAnimation.ts';

export const Cpu = ({ data }: { data: { cpuLoad: number } }) => {
    const canvasEl = useRef<HTMLCanvasElement>(null);

    // drawing is a side effect, so it belongs in an effect rather than in the
    // render body - on the first render the ref is still null
    useEffect(() => drawCircle(canvasEl.current, data.cpuLoad), [data.cpuLoad]);

    return (
        <div className="cpu col-3">
            <h3>CPU Load</h3>
            <div className="canvas-wrapper">
                <canvas ref={canvasEl} width="200" height="200"></canvas>
                <div className="cpu-text">{data.cpuLoad}</div>
            </div>
        </div>
    );
};
