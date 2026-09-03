import { useEffect, useRef, useState } from 'react';
import type { PerfData } from '@perf/contract';
import './App.css';
import { socket } from './utilities/socketConnection.ts';
import { Widget } from './perfDataComponents/Widget.tsx';

export const App = () => {
    const [performanceData, setPerformanceData] = useState<Record<string, PerfData>>({});

    // readings land here at whatever rate they arrive; state is refreshed on a
    // timer instead, so a fast machine cannot re-render the app on every tick
    const perfMachineData = useRef<Record<string, PerfData>>({});

    useEffect(() => {
        const onPerfData = (data: PerfData) => {
            perfMachineData.current[data.macA] = data;
        };

        socket.on('perfData', onPerfData);
        return () => void socket.off('perfData', onPerfData);
    }, []);

    useEffect(() => {
        const id = setInterval(() => setPerformanceData({ ...perfMachineData.current }), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="container">
            {Object.values(performanceData).map((d) => (
                <Widget data={d} key={d.macA} />
            ))}
        </div>
    );
};
