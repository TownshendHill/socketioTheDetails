import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface InfoProps {
    data: {
        macA: string;
        osType: string;
        upTime: number;
        cpuType: string;
        cpuSpeed: number;
        numCores: number;
    };
}

export const Info = ({ data }: InfoProps) => (
    <div className="col-sm-3 col-sm-offset-1 cpu-info">
        <h3>Operating System</h3>
        <div className="widget-text">{data.osType}</div>
        <h3>Time Online</h3>
        <div className="widget-text">{dayjs.duration(data.upTime, 'seconds').humanize()}</div>
        <h3>Processor information</h3>
        <div className="widget-text">
            <strong>Type:</strong> {data.cpuType}
        </div>
        <div className="widget-text">
            <strong>Number of Cores:</strong> {data.numCores}
        </div>
        <div className="widget-text">
            <strong>Clock Speed:</strong> {data.cpuSpeed}
        </div>
    </div>
);
